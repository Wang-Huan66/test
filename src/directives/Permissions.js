export default {
  install(app) {
    app.directive("permission", {
      mounted(el, binding) {
        // console.log(el, binding.value);
        haspermission(binding.value, el);
      },
    });
  },
};
function haspermission(value, el) {
  const role = JSON.parse(localStorage.getItem("userInfo")).role;
  if (el && Array.isArray(value)) {
    value.forEach((item) => {
      if (!role.includes(item) && !role.includes("all")) {
        el.disabled = true;
      }
    });
  }
}
