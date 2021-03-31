#change：改变
##模糊
* 自动模糊(7s)
```
/change autoblur/
```
* 手动进入/离开模糊(0.5s) 
```
/change blur/
/change !blur/
```
##怀旧
* 进入/离开怀旧(7s)
```
/change old/
/change !old/
```
##闪现
* 颜色闪现(0.5s)
```
/change blink/-白色
/change blood/-红色
```
## 震动
* 晃动(2s)
```
/change shake/
```
***
#集成命令
* 昏迷(5s)
```
/sleepy/  =   /change blur/  
            + /delay 4/
            + /change !blur/
```