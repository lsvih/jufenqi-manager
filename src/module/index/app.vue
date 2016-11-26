<template>
<div>
    <header>
        <tab active-color='#88C929' :index.sync="index">
            <tab-item active-class="tab-active" :selected="index === 0" v-tap="index = 0">装修订单</tab-item>
            <tab-item active-class="tab-active" :selected="index === 1" v-tap="index = 1">主材订单</tab-item>
        </tab>
    </header>

    <swiper :index.sync="index" :height="getScreenHeight()+'px'" :show-dots="false">
        <swiper-item height="100%">
            <div class="tab-swiper vux-center content">
                <scroller :height="getScreenHeight()-44-45+'px'" lock-x scroller-y v-ref:zx>
                    <no-data v-if="zxList.length === 0"></no-data>
                    <div v-else>
                        <j-order-block :img="order.customerImage" :name="order.customerName" :tel="order.customerMobile" :status="Status.zx[order.status].name" v-for="order in zxList" v-tap="viewDetail('zx',order.orderNo)"></j-order-block>
                    </div>
                </scroller>
            </div>
        </swiper-item>
        <swiper-item height="100%">
            <div class="tab-swiper vux-center content">
                <scroller :height="getScreenHeight()-44-45+'px'" lock-x scroller-y v-ref:zc>
                    <no-data v-if="wcList.length === 0"></no-data>
                    <div v-else>
                        <j-order-block :img="order.customerImage" :name="order.customerName" :tel="order.customerMobile" :status="Status.zc[order.status].name" v-for="order in zcList" v-tap="viewDetail('zc',order.orderNo)"></j-order-block>
                    </div>
                </scroller>
            </div>
        </swiper-item>
    </swiper>
</div>
<j-footer></j-footer>
</template>

<script>
import Lib from 'assets/Lib.js'
import {
    Tab,
    TabItem
} from 'vux-components/tab'
import Swiper from 'vux-components/swiper'
import SwiperItem from 'vux-components/swiper-item'
import Scroller from 'vux-components/scroller'
import JFooter from 'components/JFooter.vue'
import axios from 'axios'
import NoData from 'common/components/no-data'
import Status from 'common/status'
import JOrderBlock from 'common/components/j-order-block'
try {
    axios.defaults.headers.common['x-user-token'] = JSON.parse(localStorage.getItem("user")).token
} catch (e) {
    localStorage.clear()
    window.location.href = `./wxAuth.html?url=index.html`
}
export default {
    data() {
        return {
            index: 0,
            Status,
            zxList: [],
            zcList: [],
        }
    },
    components: {
        Tab,
        TabItem,
        Swiper,
        SwiperItem,
        Scroller,
        JFooter,
        NoData,
        JOrderBlock
    },
    ready() {
        let suc_count = 0
        this.index = (Lib.M.GetRequest().type - 1) || 0
        axios.get(`${Lib.C.orderApi}decorationOrders`, {
            params: {
                filter: `managerId:${JSON.parse(window.localStorage.getItem('user')).userId}|status:[1,6]`,
                sort: "createdAt,desc"
            }
        }).then((res) => {
            this.zxList = res.data.data
            this.$refs.zx.reset()
        }).catch((res) => {
            alert("获取订单失败，请稍候再试QAQ")
        })
        axios.get(`${Lib.C.mOrderApi}materialOrders`, {
            params: {
                filter: `managerId:${JSON.parse(window.localStorage.getItem('user')).userId}|status:[1,5]`,
                sort: "createdAt,desc"
            }
        }).then((res) => {
            this.zcList = res.data.data
            this.$refs.zc.reset()
        }).catch((res) => {
            alert("获取订单失败，请稍候再试QAQ")
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
            eval(`window.location.href='${type}-order.html?orderNo=${orderNo}'`)
        }
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
    padding-bottom: 45px;
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
</style>
