const { ref, onMounted, watch } = Vue;
export default {
  props: ["tempProduct", "addToCart"],
  template: "#userProductModal",
  setup(props) {
    const productModal = ref(null);
    const productModalRef = ref(null);
    const qty = ref(1);

    const open = () => {
      productModal.value.show();
    };
    const close = () => {
      productModal.value.hide();
    };
    onMounted(() => {
      productModal.value = new bootstrap.Modal(productModalRef.value, {
        keyboard: false,
        backdrop: "static",
      });
    });
    watch(
      () => props.tempProduct,
      () => {
        qty.value = 1;
      }
    );
    return {
      open,
      close,
      qty,
      productModalRef,
    };
  },
};
