// Form Validations
export const validateSignup = (form) => {
    
    let err = {};

    if (!form.name) err.name = "Name is required";

    if (!form.email) {
      err.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      err.email = "Invalid email format";
    }

    if (!form.password) {
      err.password = "Password is required";
    } else if (form.password.length < 8) {
      err.password = "Password must be at least 8 characters";
    }

    if (form.confirmPassword !== form.password) {
        err.confirmPassword = "Passwords do not match";
    }

    if (!form.role) {
      newErrors.role = "Please select a role";
    }
  

    return err;
};

export const validateLogin = (form = {}) => {
    let err = {};
  
    if (!form.email) {
      err.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      err.email = "Invalid email";
    }
  
    if (!form.password) {
      err.password = "Password is required";
    }
  
    return err;
  };

// Order Validations
export const storeValidate = (store) => {
  if (!store) {
    alert("Please select a store");
    return false;
  }
  return true;
};

export const amountValidate = (amount) => {
  
  if (amount === 0) {
    alert("Please add at least one product");
    return false;
  }
  return true;
};