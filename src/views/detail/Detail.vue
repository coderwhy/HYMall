<template>
  <div id="detail">
    <detail-nav-bar @itemClick="titleClick" :current-index="currentIndex"></detail-nav-bar>
    <scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            :data="[topImages, goods, shop, detailInfo, paramInfo, commentInfo, recommendList]"
            :probe-type="3">
      <div>
        <detail-swiper ref="base" :images="topImages"></detail-swiper>
        <detail-base-info :goods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo"></detail-goods-info>
        <detail-param-info ref="param" :param-info="paramInfo"></detail-param-info>
        <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
        <detail-recommend-info ref="recommend" :recommend-list="recommendList"></detail-recommend-info>
      </div>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @backTop="backTop" class="back-top" v-show="showBackTop">
      <img src="~assets/img/common/top.png" alt="">
    </back-top>
  </div>
</template>

<script>
  import Scroll from 'common/scroll/Scroll'

  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailRecommendInfo from './childComps/DetailRecommendInfo'

  import DetailBottomBar from './childComps/DetailBottomBar'
  import BackTop from 'content/backTop/BackTop'

  import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "network/detail";
  import {backTopMixin} from "@/common/mixin";
  import {BACKTOP_DISTANCE} from "@/common/const";

  export default {
		name: "Detail",
    components: {
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailRecommendInfo,
      DetailBottomBar,
		  Scroll,
		  DetailNavBar,
      DetailSwiper,
      BackTop
    },
    mixins: [backTopMixin],
    data() {
		  return {
		    iid: '',
		    topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommendList: [],
        themeTops: [],
        currentIndex: 0
      }
    },
    created() {
		  this._getDetailData()
      this._getRecommend()
    },
    updated() {
		  // 获取需要的四个offsetTop
      this._getOffsetTops()
    },
    methods: {
		  _getOffsetTops() {
		    this.themeTops = []
        this.themeTops.push(this.$refs.base.$el.offsetTop)
        this.themeTops.push(this.$refs.param.$el.offsetTop)
        this.themeTops.push(this.$refs.comment.$el.offsetTop)
        this.themeTops.push(this.$refs.recommend.$el.offsetTop)
        this.themeTops.push(Number.MAX_VALUE)
      },
      contentScroll(position) {
		    // 1.监听backTop的显示
        this.showBackTop = position.y < -BACKTOP_DISTANCE

        // 2.监听滚动到哪一个主题
        this._listenScrollTheme(-position.y)
      },
      _listenScrollTheme(position) {
        let length = this.themeTops.length;
        for (let i = 0; i < length; i++) {
          let iPos = this.themeTops[i];
          /**
           * 判断的方案:
           *  方案一:
           *    条件: (i < (length-1) && currentPos >= iPos && currentPos < this.themeTops[i+1]) || (i === (length-1) && currentPos >= iPos),
           *    优点: 不需要引入其他的内容, 通过逻辑解决
           *    缺点: 判断条件过长, 并且不容易理解
           *  方案二:
           *    条件: 给themeTops最后添加一个很大的值, 用于和最后一个主题的top进行比较.
           *    优点: 简洁明了, 便于理解
           *    缺点: 需要引入一个较大的int数字
           * 疑惑: 在第一个判断中, 为什么不能直接判断(currentPos >= iPos)即可?
           * 解答: 比如在某一个currentPos大于第0个时, 就会break, 不会判断后面的i了.
           */
          if (position >= iPos && position < this.themeTops[i+1]) {
            if (this.currentIndex !== i) {
              this.currentIndex = i;
            }
            break;
          }
        }
      },
      titleClick(index) {
        console.log(this.themeTops[index]);
        this.$refs.scroll.scrollTo(0, -this.themeTops[index], 100)
      },
      addToCart() {
        // 1.创建对象
        const obj = {}
        // 2.对象信息
        obj.iid = this.iid;
        obj.imgURL = this.topImages[0]
        obj.title = this.goods.title
        obj.desc = this.goods.desc;
        obj.newPrice = this.goods.nowPrice;
        // 3.添加到Store中
        this.$store.commit('addCart', obj)
      },
		  _getDetailData() {
		    // 1.获取iid
        const iid = this.$route.query.iid
        this.iid = iid

        // 2.请求数据
        getDetail(iid).then(res => {
          // 2.1.获取结果
          const data = res.result;

          // 2.2.获取顶部信息
          this.topImages = data.itemInfo.topImages;

          // 2.3.获取商品信息
          this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

          // 2.4.获取店铺信息
          this.shop = new Shop(data.shopInfo);

          // 2.5.获取商品信息
          this.detailInfo = data.detailInfo

          // 2.6.保存参数信息
          this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);

          // 2.7.保存评论信息
          if (data.rate.list) {
            this.commentInfo = data.rate.list[0];
          }
        })
      },
      _getRecommend() {
        getRecommend().then((res, error) => {
          if (error) return
          this.recommendList = res.data.list
        })
      }
    }
	}
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 1;
    background-color: #fff;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 60px;
  }

  .back-top {
    position: fixed;
    right: 10px;
    bottom: 65px;
  }
</style>
