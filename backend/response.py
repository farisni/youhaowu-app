from dataclasses import dataclass, asdict
from typing import Any, Optional
from flask import jsonify, make_response


@dataclass
class R:
    """统一的 API 返回结构：code, msg, data

    提供方便的构造方法和将结果转换为 Flask 响应的工具。
    """
    code: int = 0
    msg: str = "success"
    data: Any = None

    def to_dict(self) -> dict:
        return {"code": self.code, "msg": self.msg, "data": self.data}

    def to_flask(self, status_code: int = 200):
        """返回 Flask 的 `Response`（JSON）。

        Args:
            status_code: HTTP 状态码（默认 200）。
        """
        return make_response(jsonify(self.to_dict()), status_code)

    @classmethod
    def ok(cls, data: Any = None, msg: str = "successful", code: int = 0):
        return cls(code=code, msg=msg, data=data).to_flask()

    @classmethod
    def err(cls, msg: str = "error", code: int = 1, data: Any = None):
        return cls(code=code, msg=msg, data=data).to_flask(int=500)
