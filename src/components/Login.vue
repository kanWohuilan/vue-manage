<template>
  <div class="login">
    <div class="login-box">
      <div class="avatar">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form ref="form" class="login-form" :model="from" :rules="rules">
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="from.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="from.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetfrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      from: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "change" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        this.$http.post("login", this.from).then((res) => {
          if (res.data.meta.status !== 200) {
            this.$message({
              type: "error",
              message: "登录失败",
            });
            return;
          }
          this.$message({
            type: "success",
            message: "登录成功",
          });
          console.log(res.data.data.token);
          window.sessionStorage.setItem("token", res.data.data.token);
          this.$router.push({
            path: "/home",
          });
        });
      });
    },

    resetfrom() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="stylus" scoped>
.login {
  background: #2b4b6b;
  height: 100%;

  .login-box {
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar {
      height: 130px;
      width: 130px;
      position: absolute;
      left: 50%;
      border-radius: 50%;
      border: 1px solid #eee;
      transform: translate(-50%, -50%);
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      background: #fff;

      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .login-form {
      width: 100%;
      position: absolute;
      bottom: 0;
      padding: 0 20px;

      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>