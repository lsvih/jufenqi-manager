<template>
<group title="门店" v-for="shop in order.subOrders" v-if="order.subOrders.length!==0" track-by="$index">
    <div style="position:relative;">
        <x-input title="门店Id" :value.sync="shop.store.id"></x-input>
        <div class="del" slot="right"><img src="./del.png" v-tap="delShop($index)"></div>
    </div>
    <div style="position:relative;" v-for="brand in shop.brands" v-if="shop.brands.length!==0" track-by="$index">
        <x-input title="品牌名称" :value.sync="brand">
        </x-input>
        <div class="del" slot="right"><img src="./del.png" v-tap="delBrand($index,$parent.$index)"></div>
    </div>
    <div style="position:relative;height:44px">
        <div class="add"><img src="./add.png" v-tap="addBrand($index)"></div>
    </div>
    <x-input title="正价总额" :value.sync="shop.normalAmount">
    </x-input>
    <x-input title="特价总额" :value.sync="shop.specialAmount">
    </x-input>
</group>
<div class="add-shop" v-tap="addShop()">点此增加一个门店</div>
<div class="status-3-btn" :class="{'active':isFilled()}" v-tap="isFilled()?submit():return">
    <div class="btn-right">确认修改</div>
</div>
</template>

<script>
import Lib from 'assets/Lib.js'
import Group from 'vux-components/group'
import Cell from 'vux-components/cell'
import XInput from 'vux-components/x-input'
import axios from 'axios'
try{
  axios.defaults.headers.common['x-user-token'] = JSON.parse(localStorage.getItem("user")).token
}catch(e){
  localStorage.clear()
  window.location.href = `./wxAuth.html?url=index.html`
}
export default {
    data() {
        return {
            order: {},
        }
    },
    components: {
        Group,
        Cell,
        XInput,
    },
    ready() {
        axios.get(`${Lib.C.mOrderApi}materialOrders/${Lib.M.GetRequest().orderNo}`).then((res) => {
            this.order = res.data.data
        }).catch((res) => {
            alert("获取订单失败，请稍候再试QAQ")
        })
    },
    methods: {
        delShop(index) {
            this.order.subOrders.splice(index, 1)
        },
        delBrand(index, pIndex) {
            this.order.subOrders[pIndex].brands.splice(index, 1)
        },
        addShop() {
            this.order.subOrders.push({
                store: {
                    id: null
                },
                brands: [],
                specialAmount: null,
                normalAmount: null
            })
        },
        addBrand(pIndex) {
            this.order.subOrders[pIndex].brands.push("")
        },
        submit() {
            let data = []
            this.order.subOrders.map((e) => {
                data.push({
                    "storeId": e.store.id,
                    "brands": e.brands,
                    "normalAmount": e.normalAmount,
                    "specialAmount": e.specialAmount
                })
            })
            axios.post(`${Lib.C.mOrderApi}materialOrders/${Lib.M.GetRequest().orderNo}/uploadList`, JSON.stringify(data)).then((res) => {
                alert("更新订单成功")
                location.href = './zc-order.html?orderNo=${Lib.M.GetRequest().orderNo}'
            }).catch((res) => {
                alert("网络连接失败，请重试")
            })
        },
        isFilled() {
            if (this.order.subOrders.length == 0) return false
            let shops = this.order.subOrders
            for (let i = 0; i < shops.length; i++) {
                if (shops[i].store.id == null || shops[i].specialAmount == null || shops[i].normalAmount == null) return false
            }
            return true
        }
    }
}
</script>

<style>
body {
    background-color: #eee;
}
</style>
<style lang="less">
.plan-image {
    position: relative;
    width: calc(~"100% - 30px");
    margin-left: 15px;
    height: auto;
    margin-bottom: 10px;
    .image {
        width: 100%;
        height: auto;
    }
    .del {
        height: 27px;
        width: 27px;
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 2;
    }
}
.status-3-btn {
    position: relative;
    width: calc(~"100% - 30px");
    margin-left: 15px;
    border-radius: 2px;
    height: 44px;
    margin-top: 10px;
    background-color: #d8d8d8;
    color: #fff;
    line-height: 44px;
    text-align: center;
}
.active {
    background-color: rgb(158, 188, 43)!important;
}
.del {
    position: absolute;
    right: 35px;
    top: 11px;
    height: 28px;
    width: 28px;
    img {
        height: 100%;
        width: 100%;
    }
}
.add {
    position: absolute;
    right: 35px;
    top: 11px;
    height: 28px;
    width: 28px;
    img {
        height: 100%;
        width: 100%;
    }
}
.add-shop {
    height: 80px;
    width: calc(~"100% - 30px");
    margin-left: 15px;
    margin-top: 20px;
    border-radius: 5px;
    border: 1px solid #999;
    line-height: 80px;
    text-align: center;
    font-size: 14px;
    color: #999;
}
</style>
