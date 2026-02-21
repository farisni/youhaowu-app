#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import subprocess
import sys
import time
import urllib.request
import os
import tempfile

def run_cmd(cmd, shell=True, check=True, capture_output=False):
    """执行 shell 命令（兼容 Python 3.6）"""
    try:
        if capture_output:
            # Python 3.6 不支持 capture_output 参数
            result = subprocess.run(
                cmd,
                shell=shell,
                check=check,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                universal_newlines=True
            )
        else:
            result = subprocess.run(
                cmd,
                shell=shell,
                check=check,
                universal_newlines=True
            )
        return result
    except subprocess.CalledProcessError as e:
        print("❌ 命令执行失败: {}".format(cmd))
        if e.stdout:
            print("STDOUT:", e.stdout)
        if e.stderr:
            print("STDERR:", e.stderr)
        sys.exit(1)

def db_exists(db_name):
    """检查 MySQL 中是否存在指定数据库"""
    result = run_cmd(
        "docker exec -i mysql-v8.0 "
        "mysql -u root -p123456 -N -s "
        "-e \"SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME='{}';\"".format(db_name),
        capture_output=True
    )
    return result.stdout.strip() == db_name

def container_exists(name):
    result = run_cmd(
        "docker inspect {} >/dev/null 2>&1".format(name),
        check=False
    )
    return result.returncode == 0

def container_running(name):
    result = run_cmd(
        "docker inspect -f '{{.State.Running}}' {}".format(name),
        check=False,
        capture_output=True
    )
    return result.returncode == 0 and result.stdout.strip() == "true"

def check_docker():
    print("🔍 检查 Docker 环境...")
    if not run_cmd("command -v docker", capture_output=True, check=False).returncode == 0:
        print("❌ Docker 未安装，请先安装 Docker。")
        sys.exit(1)
    try:
        run_cmd("docker info", capture_output=True)
    except:
        print("❌ Docker 服务未运行，请启动 Docker Desktop 或 docker daemon。")
        sys.exit(1)
    print("✅ Docker 已就绪。")

def cleanup():
    print("♻️  清理旧资源...")
    for name in ["mysql-v8.0", "nacos-v2.1.2", "nginx-v1.13.10"]:
        if container_exists(name):
            print("✅ 容器存在: {}".format(name))
            if container_running(name):
                print("🛑 容器运行中，停止: {}".format(name))
                run_cmd("docker stop {}".format(name), check=False)
            else:
                print("ℹ️  容器已停止: {}".format(name))
            # 使用 -f 以避免状态变化导致删除失败
            print("🗑️  删除容器: {}".format(name))
            run_cmd("docker rm -f {}".format(name), check=False)
        else:
            print("⚠️  容器不存在: {}".format(name))

    if run_cmd("docker network inspect my-net >/dev/null 2>&1", check=False).returncode == 0:
        print("✅ 网络存在，删除: my-net")
        run_cmd("docker network rm my-net", check=False)
    else:
        print("⚠️  网络不存在: my-net")
    print("✅ 清理完成。")

def create_network():
    print("🌐 创建网络 my-net (172.20.0.0/16)...")
    run_cmd(
        # 如果网络已存在则跳过，否则创建
        "docker network inspect my-net >/dev/null 2>&1 || "
        "docker network create "
        "--driver bridge "
        "--subnet=172.20.0.0/16 "
        "--ip-range=172.20.0.0/24 "
        "my-net"
        ,
        check=False
    )

def start_mysql():
    print("📦 启动 MySQL 容器 (172.20.0.2)...")

    # 创建用于持久化数据的 volume（如果已存在不会报错）
    run_cmd("docker volume create mysql_data", check=False)

    run_cmd(
        "docker run -itd "
        "--name mysql-v8.0 "
        "--network my-net "
        "--ip 172.20.0.2 "
        "-e MYSQL_ROOT_PASSWORD=123456 "
        "-e LANG=C.UTF-8 "
        "-e TZ=Asia/Shanghai "
        "-p 3306:3306 "
        "-v mysql_data:/var/lib/mysql "
        "mysql:8.0 "
        "--lower-case-table-names=1 "
        "--default-authentication-plugin=mysql_native_password"
    )

def init_nacos_db():
    print("⏳ 等待 MySQL 启动（15秒）...")
    time.sleep(15)

    print("📄 从当前目录读取 Nacos SQL 脚本...")

    # 获取当前脚本所在目录
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sql_file_path = os.path.join(current_dir, "nacos-mysql.sql")

    # 检查文件是否存在
    if not os.path.exists(sql_file_path):
        print("❌ 错误：在当前目录未找到 nacos-mysql.sql 文件")
        print("请将 SQL 文件放置在: {}".format(sql_file_path))
        sys.exit(1)

    print("✅ 找到 SQL 文件: {}".format(sql_file_path))

    if db_exists("nacos"):
        print("⚠️  nacos 数据库已存在，跳过导入。")
        return

    print("🔧 创建 nacos 数据库并导入表...")
    # 创建数据库
    run_cmd("docker exec -i mysql-v8.0 mysql -u root -p123456 -e 'CREATE DATABASE IF NOT EXISTS nacos DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;'")

    # 复制SQL文件到容器
    run_cmd("docker cp {} mysql-v8.0:/tmp/nacos-mysql.sql".format(sql_file_path))

    # 导入SQL文件
    run_cmd("docker exec -i mysql-v8.0 bash -c 'mysql -u root -p123456 nacos < /tmp/nacos-mysql.sql'")

    print("✅ Nacos 数据库初始化完成")


def init_project_dbs():
    print("🔧 初始化项目业务数据库...")

    # 获取当前脚本所在目录及 sql 子目录
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sql_dir = os.path.join(current_dir, "sql")

    if not os.path.isdir(sql_dir):
        print("⚠️ 未找到 sql 目录，跳过项目数据库初始化。路径: {}".format(sql_dir))
        return

    # 遍历 sql 目录下所有 .sql 文件
    for filename in sorted(os.listdir(sql_dir)):
        if not filename.lower().startswith("wheatmall_"):
            continue

        file_path = os.path.join(sql_dir, filename)

        # 去掉后缀，得到基础名；数据库名 == 文件基础名
        base_name, _ = os.path.splitext(filename)
        db_name = base_name

        print("➡️  处理 SQL 文件: {} → 数据库: {}".format(filename, db_name))

        if db_exists(db_name):
            print("⚠️  数据库已存在，跳过导入: {}".format(db_name))
            continue

        # 1. 创建数据库（字符集和 Nacos 一致）
        run_cmd(
            "docker exec -i mysql-v8.0 "
            "mysql -u root -p123456 "
            "-e \"CREATE DATABASE IF NOT EXISTS {} "
            "DEFAULT CHARACTER SET utf8mb4 "
            "COLLATE utf8mb4_0900_ai_ci;\"".format(db_name)
        )

        # 2. 拷贝 SQL 文件到容器
        run_cmd("docker cp {} mysql-v8.0:/tmp/{}".format(file_path, filename))

        # 3. 在对应库中执行 SQL
        run_cmd(
            "docker exec -i mysql-v8.0 "
            "bash -c 'mysql -u root -p123456 {} < /tmp/{}'".format(
                db_name, filename
            )
        )

    print("✅ 项目数据库初始化完成")

def start_nacos():
    print("🚀 启动 Nacos 容器 (172.20.0.3)...")
    run_cmd(
        "docker run -d "
        "--name nacos-v2.1.2 "
        "--network my-net "
        "--ip 172.20.0.3 "
        "-e MODE=standalone "
        "-e JVM_XMS=256m "
        "-e JVM_XMX=512m "
        "-e JVM_XMN=128m "
        "-e SPRING_DATASOURCE_PLATFORM=mysql "
        "-e MYSQL_SERVICE_HOST=172.20.0.2 "
        "-e MYSQL_SERVICE_PORT=3306 "
        "-e MYSQL_SERVICE_DB_NAME=nacos "
        "-e MYSQL_SERVICE_USER=root "
        "-e MYSQL_SERVICE_PASSWORD=123456 "
        "-p 8848:8848 "
        "-p 9848:9848 "
        "-p 9849:9849 "
        "nacos/nacos-server:v2.1.2-slim"
    )

def start_nginx():
    print("🚀 启动 Nginx 容器 (172.20.0.4)...")
    run_cmd(
        "docker run -d "
        "--name nginx-v1.13.10 "
        "--net my-net "
        "--ip 172.20.0.4 "
        "-p 80:80 "
        "-v ~/faris/vol/nginx/html:/usr/share/nginx/html:ro "
        "-v ~/faris/vol/nginx/conf/conf.d:/etc/nginx/conf.d:ro "
        "-v ~/faris/vol/nginx/conf/nginx.conf:/etc/nginx/nginx.conf:ro "
        "-v ~/faris/vol/nginx/logs:/var/log/nginx "
        "nginx:1.13.10"
    )

def main():
    if len(sys.argv) > 1 and sys.argv[1] == "cleanup":
        cleanup()
        return

    print("🚀 开始部署 Nacos + MySQL 开发环境（固定 IP 版）...")
    check_docker()
    cleanup()
    create_network()
    start_mysql()
    init_nacos_db()
    init_project_dbs()
    start_nacos()
    start_nginx()

    print("\n⏳ 等待 Nacos 启动（30秒）...")
    time.sleep(30)

    print("\n✅ 部署完成！")
    print("\n🔗 Nacos 控制台: http://localhost:8848/nacos")
    print("👤 账号密码: nacos / nacos")
    print("\n📊 容器 IP 信息:")
    print("   MySQL  → 172.20.0.2 (宿主机访问: localhost:3306)")
    print("   Nacos  → 172.20.0.3")
    print("   Nginx  → 172.20.0.4 (宿主机访问: localhost:80)")
    print("\n📌 常用命令:")
    print("   查看日志: docker logs nacos-v2.1.2")
    print("   停止服务: docker stop mysql-v8.0 nacos-v2.1.2 nginx-v1.13.10")
    print("   彻底清理: python3 deploy_nacos_mysql.py cleanup\n")

if __name__ == "__main__":
    main()
