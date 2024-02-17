import userModal from "./userProductModal.js";
const { createApp, ref, onMounted } = Vue;
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});
const apiUrl = 'https://vue3-course-api.hexschool.io/v2'
const apiPath = 'rubby-api'

const app = createApp({
  setup() {
    const products = ref([]);
    const tempProduct = ref({});
    const status = ref({
      loadingItem: '',
    });
    const carts = ref({});
    const userModal = ref(null);
    const formRef = ref(null);
    const form = ref({
      user: {
        name: '',
        email: '',
        tel: '',
        address: '',
      },
      message: '',
    });

    const getProducts = () => {
      const url = `${apiUrl}/api/${apiPath}/products/all`;
      axios.get(url).then((res) => {
        products.value = res.data.products;
        console.log(res.data.products);
      });
    };
    const openModal = (product) => {
      tempProduct.value = product;
      userModal.value.open()
    };
    const addToCart = (product_id, qty = 1) => {
      status.value.loadingItem = product_id;
      const order = {
        product_id,
        qty
      }
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.post(url, { data: order }).then((res) => {
        status.value.loadingItem = ''
        alert(res.data.message);
        getCart();
        userModal.value.close()
      })
    };
    const changeCartQty = (item, qty = 1) => {
      const order = {
        product_id: item.product_id,
        qty
      }
      status.value.loadingItem = item.id;
      const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      axios.put(url, { data: order }).then((res) => {
        status.value.loadingItem = ''
        // alert(res.data.message);
        getCart();
      })
    };
    const removeCartItem = (id) => {
      status.value.loadingItem = id;
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      axios.delete(url).then((res) => {
        status.value.loadingItem = ''
        alert(res.data.message);
        getCart();
      })
    };
    const removeCartAllItem = () => {
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(url).then((res) => {
        alert('確定要清空購物車?');
        getCart();
      })
    };
    const getCart = () => {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.get(url).then((res) => {
        carts.value = res.data.data;
      })
    };
    // 表單驗證
    const createOrder = () => {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = form.value;
      axios.post(url, { data: order }).then((response) => {
        alert(response.data.message);
        formRef.value.resetForm();
        getCart();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    };

    onMounted(() => {
      getProducts();
      getCart();
    })
    return {
      products,
      tempProduct,
      status,
      carts,
      userModal,
      form,
      getProducts,
      openModal,
      addToCart,
      changeCartQty,
      removeCartItem,
      removeCartAllItem,
      getCart,
      createOrder,
    };
  },
});
app.component('user-modal', userModal)
app.component('v-form', Form)
app.component('v-field', Field)
app.component('error-message', ErrorMessage)
app.mount('#app');

