import Mock from "mockjs";
// 脚手架会通过babel降级语法，js使用需要使用commonjs语法
// const Mock = require('mockjs')

Mock.mock("/login", "post", (config) => {
  let username = JSON.parse(config.body).username;
  let password = JSON.parse(config.body).password;
  let token = (Math.random() * 10).toString(36).slice(2);
  if (password !== "123456") return { message: "账号密码错误", code: 201 };
  if (username === "admin")
    return {
      message: "登陆成功",
      role: ["all"],
      token: token,
      code: 200,
    };
  else if (username === "admin1")
    return {
      message: "登陆成功",
      role: ["look"],
      token: token,
      code: 200,
    };
  else if (username === "admin2")
    return {
      message: "登陆成功",
      role: ["add", "look"],
      token: token,
      code: 200,
    };
  else return { message: "没有该账户", code: 201 };
});
Mock.mock(`/layout`, "get", (config) => {
  // 一般要验证token
  return {
    message: "获取成功",
    code: 200,
    data: [
      {
        title: "首页",
        icon: "icon-home",
        path: "/index/index",
      },
      {
        title: "商品列表",
        icon: "icon-apps",
        path: "/index/product",
      },
    ],
  };
});
let data;
if (localStorage.getItem("list"))
  data = { data: JSON.parse(localStorage.getItem("list")) };
else {
  data = Mock.mock({
    // 20条数据
    "data|20": [
      {
        // 商品Id
        "goodsId|+1": 1,
        //商品名称
        goodsName: "@ctitle(10)",
        //商品售价
        "inventory|30-500": 30,
        // 入库时间
        createTime: "@date",
        // 库存量
        "inventory|50-300": 60,
      },
    ],
  });
  localStorage.setItem("list", JSON.stringify(data.data));
}

Mock.mock("/list", "post", (config) => {
  let body = JSON.parse(config.body);
  let start = (body.page - 1) * body.pageSize;
  let end = body.page * body.pageSize;
  let list = data.data
    .filter((item) => {
      return body.goodsName
        ? item.goodsName.indexOf(body.goodsName)
        : true && body.createTime
        ? item.createTime.includes(body.createTime)
        : true && body.goodsId
        ? item.goodsId === Number(body.goodsId)
        : true;
    })
    .slice(start, end);
  // 返回的数据
  return {
    message: "获取成功",
    code: 200,
    total:
      body.goodsName || body.createTime || body.goodsId
        ? list.length
        : data.data.length,
    data: list,
  };
});

// 添加
Mock.mock("/add", "post", (config) => {
  const body = JSON.parse(config.body);
  body.goodsId = Number(body.goodsId);
  body.inventory = Number(body.inventory);
  if (data.data.find((item) => Number(item.goodsId) === Number(body.goodsId))) {
    return {
      code: 301,
      message: "商品Id已存在",
    };
  }
  data.data.unshift(body);
  localStorage.setItem("list", JSON.stringify(data.data));
  return {
    code: 200,
    message: "添加成功",
  };
});
// 编辑
Mock.mock("/edit", "post", (config) => {
  const body = JSON.parse(config.body);
  body.goodsId = Number(body.goodsId);
  body.inventory = Number(body.inventory);
  let index = data.data.findIndex(
    (item) => Number(item.goodsId) === Number(body.goodsId)
  );
  if (index !== -1) {
    data.data[index] = body;
  }
  localStorage.setItem("list", JSON.stringify(data.data));
  return {
    code: 200,
    message: "修改成功",
  };
});
// 删除
Mock.mock("/del", "post", (config) => {
  const body = JSON.parse(config.body);
  data.data = data.data.filter(
    (item) => Number(item.goodsId) !== Number(body.id)
  );
  localStorage.setItem("list", JSON.stringify(data.data));
  return {
    code: 200,
    message: "删除成功",
  };
});
