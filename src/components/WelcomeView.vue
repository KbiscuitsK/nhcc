<template>
  <h2 style="margin: 4px;">东软熙康体检中心</h2>
  <el-row>
    <el-col :span="16" :offset="4">
      <h4 style="text-align: center;">云医院平台服务</h4>
      <p style=" text-align: left;text-indent: 2em;line-height: 1.6; margin: 1em 0;">
        以城市为入口，为地方政府、医疗机构和保险机构提供平台建设服务，帮助政府打造城市医疗基础设施平台⸺云医院平台，提供超越医院物理围墙的服务内容，打造协作高效的医疗服务体系，为医疗健康服务“供需付管”四方赋能，帮助医院/医生更好服务患者,帮助保险机构提高资金使用效率，帮助患者更好获取院内院外一体化的医疗健康服务。
      </p>
      <h4>互联网医疗服务</h4>
      <p style=" text-align: left;text-indent: 2em;line-height: 1.6; margin: 1em 0;">
        基于云医院平台，为医疗机构提供运营等平台增值服务。通过互联网医院服务、远程医疗服务、互联网居家护理服务、智慧家庭医生服务等，满足用户的多元化医疗健康服务需求，为用户提供线上线下全渠道、院内院外全场景、覆盖全生命周期的一体化互联网医疗服务，实现医疗健康服务的便利可及。
      </p>
      <h4>健康管理服务</h4>
      <p style=" text-align: left;text-indent: 2em;line-height: 1.6; margin: 1em 0;">
        通过整合优质的医疗资源，为个人及企业客户提供优质、便捷、线上线下一体化的全生命周期医疗和健康管理服务。包括健康体检、疾病检测、基因检测、慢病管理与康复、远程医疗、中医以及运动康复、营养膳食指导等线下健康服务，以及报告解读、健康档案建立、检后随访、健康管理、线上问诊、健康宣教、中西医结合防治等线上医疗健康服务，打造健康管理服务闭环。
      </p>
      <h4>护理服务</h4>
      <p style=" text-align: left;text-indent: 2em;line-height: 1.6; margin: 1em 0;">
        护理服务业务将专业的护理服务延伸至院外场景，为用户提供安全、可靠、同质的居家护理服务和在线护理咨询服务。2016年，熙康云医院在宁波市率先开展“居家护理服务”的创新试点，通过8年的积累，构建起了一套完整的运营服务体系，并以宁波“一地创新、全省共享”逐渐开启在全中国范围内的居家护理业务复制和拓展。与此同时，熙康云医院持续推动政府部门建立完善的居家护理服务规范体系，建立城市统一的管理制度、服务模式、
        运行机制、培训制度等标准，让居民可以在一个区域内享受到统一服务质量的居家护理服务。
      </p>

    </el-col>
  </el-row>
  <el-row>
    <el-col>
      <img alt="bg001" src="../assets/bg001.jpg" height="320px" />
    </el-col>
  </el-row>
</template>

<script>
import { OfficeBuilding } from '@element-plus/icons-vue';
import axios from 'axios';
export default {
  name: 'WelcomeView',
  data() {
    return {
    }
  }
}
</script>
