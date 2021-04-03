<template>
  <div id="helpBlock">
    <table cellspacing="10" style="width: 100%">
      <tr>
        <td>A</td>
        <td>开始/停止自动翻页</td>
        <td>↑↓</td>
        <td>自动翻页速度</td>
      </tr>
      <tr>
        <td>Q</td>
        <td>快速跳跃至下一处</td>
        <td>P</td>
        <td>跳跃回到上一处</td>
      </tr>
      <tr>
        <td>S</td>
        <td>存档</td>
        <td>L</td>
        <td>读档</td>
      </tr>
      <tr>
        <td>M</td>
        <td>音乐开启关闭</td>
        <td>N</td>
        <td>语音开启关闭</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="less">
#helpBlock{
  position: absolute;
  top:2rem;
  left: 0;
  right: 0;
  width:calc(100% - 4rem);
  margin: auto;
  border-radius: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  color:white;
  z-index: 1000;
  padding: 2rem 4rem;
  box-sizing: border-box;
  td:nth-child(odd){
    width: 4rem;
  }
  td:nth-child(even){
    width: calc(50% - 4rem);
  }
}
</style>