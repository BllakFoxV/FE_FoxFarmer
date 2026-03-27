export const ENDPOINTS = {
  SCRIPTS: {
    LIST: '/script/',
    LOAD: (name) => `/script/detail/${name}`,
    SAVE: '/script/save',
    TEST_STEP: (id)=> `/script/${id}/test_step`
  },
  DEVICES: {
    LIST: '/device/refresh',
    SCREENSHOT: (id) => `/device/${id}/screenshot`,
    START: (id) => `/device/${id}/start`,
    STOP: (id) => `/device/${id}/stop`,
  }
};