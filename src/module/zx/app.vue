<template>
<div>
    <header>
        <tab active-color='#88C929' :index.sync="index">
            <tab-item class="tab" active-class="tab-active" :selected="index === 0" v-tap="index = 0">已预约</tab-item>
            <tab-item class="tab" active-class="tab-active" :selected="index === 1" v-tap="index = 1">待选方案</tab-item>
            <tab-item class="tab" active-class="tab-active" :selected="index === 2" v-tap="index = 2">待支付</tab-item>
            <tab-item class="tab" active-class="tab-active" :selected="index === 3" v-tap="index = 3">待施工</tab-item>
            <tab-item class="tab" active-class="tab-active" :selected="index === 4" v-tap="index = 4">施工中</tab-item>
        </tab>
    </header>

    <swiper :index.sync="index" :height="getScreenHeight()+'px'" :show-dots="false">
        <swiper-item height="100%">
            <div class="tab-swiper vux-center content">
                <scroller :height="getScreenHeight()-88+'px'" lock-x scroller-y v-ref:lista>
                  <div>
                    <no-data v-if="list0.length==0"></no-data>
                    <div v-else v-for="order in list0">
                        <j-order-block v-tap="viewDetail('zx',order.orderNo,order.plan.id)" :img="order.customerImage" :name="order.customerName" :tel="order.customerMobile" :time="getTime(order.createdAt)"></j-order-block>
                        <div class="operate"><div v-if="order.status == 1" v-tap="(tempOrderNo = order.orderNo,showConfirm.visit = true)">已上门</div></div>
                    </div>
                  </div>
                </scroller>
            </div>
        </swiper-item>
        <swiper-item height="100%">
            <div class="tab-swiper vux-center content">
                <scroller :height="getScreenHeight()-88+'px'" lock-x scroller-y v-ref:listb>
                  <div>
                    <no-data v-if="list1.length==0"></no-data>
                    <div v-else>
                        <j-order-block v-for="order in list1" v-tap="viewDetail('zx',order.orderNo,order.plan.id)" :img="order.customerImage" :name="order.customerName" :tel="order.customerMobile" :time="getTime(order.createdAt)"></j-order-block>
                    </div>
                  </div>
                </scroller>
            </div>
        </swiper-item>
        <swiper-item height="100%">
            <div class="tab-swiper vux-center content">
                <scroller :height="getScreenHeight()-88+'px'" lock-x scroller-y v-ref:listc>
                  <div>
                    <no-data v-if="list2.length==0"></no-data>
                    <div v-else>
                        <j-order-block v-for="order in list2" v-tap="viewDetail('zx',order.orderNo,order.plan.id)" :img="order.customerImage" :name="order.customerName" :tel="order.customerMobile" :time="getTime(order.createdAt)"></j-order-block>
                          <div class="operate"><div v-if="order.status == 4" v-tap="(tempOrderNo = order.orderNo,showConfirm.pay = true)">已支付</div></div>
                    </div>
                  </div>
                </scroller>
            </div>
        </swiper-item>
        <swiper-item height="100%">
            <div class="tab-swiper vux-center content">
                <scroller :height="getScreenHeight()-88+'px'" lock-x scroller-y v-ref:listd>
                  <div>
                    <no-data v-if="list3.length==0"></no-data>
                    <div v-else>
                        <j-order-block v-for="order in list3" v-tap="viewDetail('zx',order.orderNo,order.plan.id)" :img="order.customerImage" :name="order.customerName" :tel="order.customerMobile" :time="getTime(order.createdAt)"></j-order-block>
                        <div class="operate"><div v-if="order.status == 5" v-tap="(tempOrderNo = order.orderNo,showConfirm.start = true)">已开工</div></div>
                    </div>
                  </div>
                </scroller>
            </div>
        </swiper-item>
        <swiper-item height="100%">
            <div class="tab-swiper vux-center content">
                <scroller :height="getScreenHeight()-88+'px'" lock-x scroller-y v-ref:liste>
                  <div>
                    <no-data v-if="list4.length==0"></no-data>
                    <div v-else>
                        <j-order-block v-for="order in list4" v-tap="viewDetail('zx',order.orderNo,order.plan.id)" :img="order.customerImage" :name="order.customerName" :tel="order.customerMobile" :time="getTime(order.createdAt)"></j-order-block>
                        <div class="operate"><div v-if="order.status == 6" v-tap="(tempOrderNo = order.orderNo,showConfirm.complete = true)">已完工</div></div>
                    </div>
                  </div>
                </scroller>
            </div>
        </swiper-item>
    </swiper>
</div>
<j-footer></j-footer>
<confirm :show.sync="showConfirm.visit" title="" confirm-text="是" cancel-text="否" @on-confirm="visit(tempOrderNo)">
  <p style="text-align:center;">确认工长已上门?</p>
</confirm>
<confirm :show.sync="showConfirm.start" title="" confirm-text="是" cancel-text="否" @on-confirm="start(tempOrderNo)">
  <p style="text-align:center;">确认工长已开工?</p>
</confirm>
<confirm :show.sync="showConfirm.complete" title="" confirm-text="是" cancel-text="否" @on-confirm="complete(tempOrderNo)">
  <p style="text-align:center;">确认工长已经完工?</p>
</confirm>
<confirm :show.sync="showConfirm.pay" title="" confirm-text="是" cancel-text="否" @on-confirm="pay(tempOrderNo)">
  <p style="text-align:center;">确认用户已经支付?</p>
</confirm>
</template>

<script>
import Lib from 'assets/Lib.js'
import {
    Tab,
    TabItem
} from 'vux-components/tab'
import JFooter from 'components/JFooter'
import Swiper from 'vux-components/swiper'
import SwiperItem from 'vux-components/swiper-item'
import Scroller from 'vux-components/scroller'
import JOrderBlock from 'common/components/j-order-block'
import NoData from 'common/components/no-data'
import axios from 'axios'
import Confirm from 'vux-components/confirm'
import Status from 'common/status'
try {
    let now = Number(new Date().getTime())
    if (Number(JSON.parse(localStorage.user).expiredAt) < now) {
        localStorage.removeItem('user')
        location.href = './wxAuth.html?url=' + encodeURIComponent(location.href)
    }
    axios.defaults.headers.common['Authorization'] = JSON.parse(localStorage.getItem("user")).tokenType + ' ' + JSON.parse(localStorage.getItem("user")).token
} catch (e) {
    localStorage.clear()
    window.location.href = `./wxAuth.html?url=index.html`
}
export default {
    data() {
        return {
            index: 0,
            list0: [],
            list1: [],
            list2: [],
            list3: [],
            list4: [],
            Status,
            tempOrderNo: null,
            showConfirm:{
              visit:false,
              start:false,
              complete:false,
              pay:false
            }
        }
    },
    components: {
        Tab,
        TabItem,
        Swiper,
        SwiperItem,
        Scroller,
        JOrderBlock,
        JFooter,
        Confirm,
        NoData
    },
    ready() {
        let suc_count = 0
        this.index = (Lib.M.GetRequest().type - 1) || 0
        axios.get(`${Lib.C.orderApi}decorationOrders`, {
            params: {
                filter: `managerId:${JSON.parse(window.localStorage.getItem('user')).userId}|status:[1,6]`
            }
        }).then((res) => {
            res.data.data.map((e) => {
                switch (e.status) {
                    case 1:
                        this.list0.push(e)
                        break;
                    case 2:
                        this.list1.push(e)
                        break;
                    case 3:
                        this.list1.push(e)
                        break;
                    case 4:
                        this.list2.push(e)
                        break;
                    case 5:
                        this.list3.push(e)
                        break;
                    case 6:
                        this.list4.push(e)
                        break;
                    default:
                        break;
                }
            })
            this.$nextTick(() => {
                this.$refs.lista.reset()
                this.$refs.listb.reset()
                this.$refs.listc.reset()
                this.$refs.listd.reset()
                this.$refs.liste.reset()
            })
        }).catch((err) => {
            alert("获取订单失败，请稍候再试QAQ")
            throw err
        })
    },
    methods: {
        getScreenHeight() {
            return document.body.clientHeight
        },
        getTime(timeStamp) {
            var d = new Date(timeStamp * 1000);
            var Y = d.getFullYear() + '-';
            var M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-';
            var D = (d.getDate() < 10 ? '0' + (d.getDate()) : d.getDate());
            return Y + M + D
        },
        viewDetail(type, orderNo, planId) {
            eval(`window.location.href='${type}-order.html?orderNo=${orderNo}&planId=${planId}'`)
        },
        visit(orderNo) {
            axios.post(`${Lib.C.orderApi}decorationOrders/${orderNo}/confirmVisit`).then((res) => {
                alert("订单已更新！")
                location.reload()
            }).catch((res) => {
                alert("更新订单失败，请稍后重试")
            })
        },
        start(orderNo) {
            axios.post(`${Lib.C.orderApi}decorationOrders/${orderNo}/confirmStart`).then((res) => {
                alert("订单已更新！")
                location.reload()
            }).catch((res) => {
                alert("更新订单失败，请稍后重试")
            })
        },
        complete(orderNo) {
            axios.post(`${Lib.C.orderApi}decorationOrders/${orderNo}/confirmComplete`).then((res) => {
                alert("订单已更新！")
                location.reload()
            }).catch((res) => {
                alert("更新订单失败，请稍后重试")
            })
        },
        pay(orderNo) {
            axios.post(`${Lib.C.orderApi}decorationOrders/${orderNo}/confirmPay`).then((res) => {
                alert("订单已更新！")
                location.reload()
            }).catch((res) => {
                alert("更新订单失败，请稍后重试")
            })
        },
    }
}
</script>

<style>
html {
    height: 100%;
}

body {
    background-color: #eee;
    height: 100%;
}
</style>
<style scoped lang="less">
.content {
    padding-top: 45px;
}
header {
    position: fixed;
    height: 44px;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 30;
}
.tab-active {
    color: #88C929 !important;
    border-color: #88C929 !important;
}
.tab {
    font-size: 12px!important;
}
.operate {
    height: 30px;
    width: calc(~"100% - 30px");
    padding: 7px 15px;
    background-color: #fff;
    text-align: right;
    margin-bottom: 5px;
    div {
        display: inline-block;
        height: 30px;
        width: 70px;
        line-height: 30px;
        text-align: center;
        color: #999;
        border: 1px solid #999;
        border-radius: 5px;
        font-size: 12px;
        margin-left: 20px;
    }
}
.none{
    height: 0!important;
    padding: 0!important;
}
</style>
