<template>
    <router-view/>
</template>

<script>
export default {
}
</script>
<style>
.auth-btn {
  width: 100%;
  background-color: #ee3943;
  color: #fff;
  padding: 6px;
  border-radius: 30px;
  margin: 20px 0px 20px 0px;
  font-family: "Quicksand", sans-serif;
  transition: box-shadow 0.3s ease-in-out;
}

.auth-btn:hover {
   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}
</style>
