import axios from './axios'


export function getCategory() {
  return axios({
    url: '/category'
  })
}

export function getSubcategory(maitKey) {
  return axios({
    url: '/subcategory',
    params: {
      maitKey
    }
  })
}

export function getCategoryDetail(miniWallkey, type) {
  return axios({
    url: '/subcategory/detail',
    params: {
      miniWallkey,
      type
    }
  })
}
