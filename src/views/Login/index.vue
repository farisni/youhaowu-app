<template>
  <div>
    <header class="login-header">
      <div class="container m-top-20">
        <h1 class="logo">
          <RouterLink to="/">有好物</RouterLink>
        </h1>
        <RouterLink class="entry" to="/">
          进入网站首页
          <i class="iconfont icon-angle-right"></i>
          <i class="iconfont icon-angle-right"></i>
        </RouterLink>
      </div>
    </header>
    <section class="login-section">

      <div class="wrapper">
        <nav>
          <a @click="activeName='account'" href="javascript:;" :class="{active:activeName==='account'}">账户登录</a>
          <a @click="activeName='qrcode'" href="javascript:;" :class="{active:activeName==='qrcode'}">扫码登录</a>
        </nav>
        <div class="toggle">
          <a >
            <i class="iconfont icon-user"></i> 使用账号登录
          </a>
          <!--<a @click="isMsgLogin=true" href="javascript:;" v-else>-->
          <!--  <i class="iconfont icon-msg"></i> 使用短信登录-->
          <!--</a>-->
        </div>
        <div class="account-box">
          <div class="form">
            <el-form ref="formRef" :model="form" :rules="rules"  status-icon  style="max-width: 300px">
              <!--label="用户"-->
              <el-form-item  label="" prop="account">
                <el-input v-model="form.account"   placeholder="请输入账号">
                  <template #prepend>
                    <el-button :icon="User" />
                  </template>
                </el-input>
              </el-form-item>
              <!--label="密码"-->
              <el-form-item  prop="password" >
                <el-input show-password v-model="form.password" placeholder="请输入密码">
                  <template #prepend>
                    <el-button :icon="Lock" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item  prop="agree">
                <el-checkbox v-model="form.agree"  size="large">
                  我已同意隐私条款和服务条款
                </el-checkbox>
              </el-form-item>
              <el-button size="large" class="subBtn" @click="login">点击登录</el-button>
            </el-form>
          </div>
        </div>
      </div>
    </section>

    <footer class="login-footer">
      <div class="container">
        <p>
          <a href="javascript:;">关于我们</a>
          <a href="javascript:;">帮助中心</a>
          <a href="javascript:;">售后服务</a>
          <a href="javascript:;">配送与验收</a>
          <a href="javascript:;">商务合作</a>
          <a href="javascript:;">搜索推荐</a>
          <a href="javascript:;">友情链接</a>
        </p>
        <p>CopyRight &copy; 有好物</p>
      </div>
    </footer>
  </div>
</template>
<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { User,Lock } from '@element-plus/icons-vue'

const router = useRouter()

// 获取登录时用户数据存储实例对象
const userStore = useUserStore()

const activeName = ref('account')

// 表单对象
const form = ref({
  account: 'heima290',
  password: 'hm#qd@23!',
  agree: true
})

// 规格数据对象
const rules = {
  account: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 14, message: '密码长度：6-14个字符', trigger: 'blur' }
  ],
  agree: [
    {
      // 自定义校验
      validator(rule, value, callback) {
        // 不勾选进行提示
        if(value) {
          callback()
        } else {
          callback(new Error('请勾选协议'))
        }
      }
    }
  ]
}


// 表单统一校验
const formRef = ref(null)

const login = () => {
  formRef.value.validate(async (valid) => {
    // 校验通过
    if(valid) {
      const { account, password } = form.value
      await userStore.getUserInfo({ account, password })
      ElMessage({
        type: 'success',
        message: '登录成功'
      })
      /*跳转到主页， replace 不回头*/
      router.replace({ path: '/' })
    }
  })
}
</script>
<style scoped lang="scss">
</style>
<style scoped lang='scss'>
.login-header {
  background: #fff;
  border-bottom: 1px solid #e4e4e4;

  .container {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .logo {
    width: 200px;
    a {
      display: block;
      height: 110px;
      width: 100%;
      text-indent: -9999px;
      background: url("@/assets/images/youhaowu.svg") no-repeat center 18px / contain;
    }
  }

  .sub {
    flex: 1;
    font-size: 24px;
    font-weight: normal;
    margin-bottom: 38px;
    margin-left: 20px;
    color: #666;
  }

  .entry {
    width: 120px;
    margin-bottom: 38px;
    font-size: 16px;

    i {
      font-size: 14px;
      color: $yhwColor;
      letter-spacing: -5px;
    }
  }
}

.login-section {
  background: url('@/assets/images/login-bg.png') no-repeat center / cover;
  height: 488px;
  position: relative;

  .wrapper {
    width: 380px;
    height: 370px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translate3d(100px, 0, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);

    .toggle {
      padding: 15px 40px;
      text-align: right;
      a {
        color: $yhwColor;
        i {
          font-size: 14px;
        }
      }
    }

    nav {
      font-size: 14px;
      height: 55px;
      //margin-bottom: 20px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 60px;
      text-align: right;
      align-items: center;

      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;

        &:first-child {
          border-right: 1px solid #f5f5f5;
          text-align: left;
        }
        &.active{
          color:$yhwColor;
          font-weight: bold;
        }
      }
    }
  }
}

.login-footer {
  padding: 30px 0 50px;
  background: #fff;

  p {
    text-align: center;
    color: #999;
    padding-top: 20px;

    a {
      line-height: 1;
      padding: 0 10px;
      color: #999;
      display: inline-block;

      ~a {
        border-left: 1px solid #ccc;
      }
    }
  }
}

.account-box {
  display: flex;
  justify-content: space-around;
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: $yhwColor;
      i {
        font-size: 14px;
      }
    }
  }

  .form {

    .el-form-item {
      margin-bottom: 22px;
      :deep(.el-form-item__error) {
        padding-top: 5px;
      }

    }

    .el-form-item:last-of-type {
      :deep(.el-form-item__error) {
        //margin-top: -7px;
        padding-top: 0;
      }
    }

    .el-input {
      width: 300px;
      height: 38px;
      //margin-bottom: 10px;
      //margin: 5px auto;
    }



    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: $yhwColor;

      &.disabled {
        background: #cfcdcd;
      }
    }
  }

  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}

.subBtn {
  background: $yhwColor;
  width: 100%;
  color: #fff;
}
</style>
