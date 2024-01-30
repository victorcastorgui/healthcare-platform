export type Products = {
  data: {
    id?: number;
    name: string;
    floor_price: string;
    top_price: string;
    selling_unit: string;
    image: string;
  }[];
  current_page: number;
  current_item: number;
  total_page: number;
  total_item: number;
};

export type ProductSuper = {
  data: {
    id?: number;
    name: string;
    manufacture: string;
    detail: string;
    product_category_id: number;
    unit_in_pack: string;
    weight: string;
    height: string;
    length: string;
    width: string;
    image: string;
    generic_name: string;
    drug_form_id: number;
    drug_classification_id: number;
    content: string;
    price: string;
    selling_unit: string;
    is_hidden: boolean;
  };
};

export type Product = {
  data: {
    id?: number;
    name: string;
    manufacture: string;
    detail: string;
    product_category_id: number;
    unit_in_pack: string;
    weight: string;
    height: string;
    length: string;
    width: string;
    image: string;
    generic_name: string;
    drug_form_id: number;
    drug_classification_id: number;
    content: string;
    top_price: string;
    floor_price: string;
    selling_unit: string;
    is_hidden: boolean;
  };
};

export type Doctors = {
  name: string;
  image: string;
  specialization: string;
  fee: string;
  yoe: number;
  certificate: string;
  status: string;
};

export type TCart = {
  data: {
    total_amount: string;
    total_item: number;
    cart_item: TCartItem[];
  };
};

export type TOrderItemAll = {
  total_amount: string;
  total_item: number;
  order_item: TOrderItem[];
};

export type TOrderItem = {
  id: number;
  name: string;
  unit_in_pack: string;
  price: string;
  image: string;
  qty: number;
  sub_total: string;
};

export type TCartItem = {
  id: number;
  name: string;
  unit_in_pack: string;
  price: string;
  image: string;
  qty: number;
  sub_total: string;
  is_checked: boolean;
};

export type Order = {
  data: OrderData[];
  current_page: number;
  current_item: number;
  total_page: number;
  total_item: number;
};

export type OrderData = {
  id: string;
  order_items: {
    id: number;
    name: string;
    quantity: number;
    sub_total: string;
    image: string;
  }[];
  item_order: number;
  order_date: string;
  shipping_name: string;
  shipping_price: string;
  shipping_eta: string;
  total_price: string;
  order_status: string;
};

export type OrderDetail = {
  data: {
    id: string;
    order_items: {
      id: number;
      name: string;
      quantity: number;
      sub_total: string;
      image: string;
    }[];
    ordered_at: string;
    expired_at: string;
    order_status: number;
    product_price: string;
    shipping_name: string;
    shipping_price: string;
    shipping_eta: string;
    total_price: string;
    payment_proof: string;
    name: string;
    street: string;
    postal_code: string;
    phone: string;
    detail: string;
    province: string;
    city: string;
    pharmacy_contact: string;
    pharmacy_email: string;
  };
};

export type Chats = {
  data: {
    id: number;
    ordered_at: string;
    expired_at: string;
    status: string;
    total_payment: string;
    proof: string;
    sick_leave_pdf: string;
    prescription_pdf: string;
    last_message: string;
    profile: {
      name: string;
      image: string;
      birth_date: string;
    };
    doctor: {
      name: string;
      image: string;
      status: string;
    };
    chats: {
      user_id: number;
      chat_time: string;
      message: string;
      message_type: number;
    }[];
  }[];
  current_page: number;
  current_item: number;
  total_page: number;
  total_item: number;
};

export type Chat = {
  data: {
    id: number;
    ordered_at: string;
    expired_at: string;
    status: string;
    total_payment: string;
    proof: string;
    sick_leave_pdf: string;
    prescription_pdf: string;
    last_message: string;
    profile: {
      id: number;
      name: string;
      image: string;
      birth_date: string;
    };
    doctor: {
      id: number;
      name: string;
      image: string;
      status: string;
    };
    chats: {
      user_id: number;
      chat_time: string;
      message: string;
      message_type: number;
    }[];
  };
  current_page: number;
  current_item: number;
  total_page: number;
  total_item: number;
};

export type ConsultHistory = {
  id?: number;
  user_id: number;
  consultation_id: number;
  consultation_date: string;
  doctor_name: string;
  doctor_picture: string;
  price: number;
  chat_status: string;
};

export type DoctorList = {
  data: {
    id: number;
    name: string;
    image: string;
    specialization: string;
    specialization_id: string;
    fee: string;
    yoe: string;
    certificate: string;
    status: string;
  }[];
  current_page: number;
  current_item: number;
  total_page: number;
  total_item: number;
};

export type TUser = {
  name: string;
  email: string;
  dob: string;
  image: string;
};

export type DoctorSpecializations = {
  id: number;
  name: string;
  image: string;
};

export type ProductCategory = {
  data: { id: number; name: string; is_drug: boolean; image: string }[];
  current_page: number;
  current_item: number;
  total_page: number;
};

export type CategoryData = {
  data: { name: string; is_drug: boolean; image: string };
};

export type TData<T> = {
  message?: string;
  data?: T;
};

export type TShippingMethod = {
  id: number;
  name: string;
  duration: string;
  cost: string;
};

export type TAddress = {
  id?: number;
  name: string;
  phone: string;
  province_id?: number;
  city_id?: number;
  province?: string;
  city?: string;
  longitude: string;
  latitude: string;
  street: string;
  detail: string;
  postal_code: string;
  is_default: boolean;
};

export type TProvince = {
  id?: number;
  name: string;
  code: string;
  cities?: TProvince[];
};

export type PostResponse = {
  message: string;
};
export type ProductList = {
  data: {
    id: number;
    name: string;
    price: string;
    selling_unit: string;
    image: string;
  }[];
  current_page: number;
  current_item: number;
  total_page: number;
};

export type PharmacyAdmin = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export type PharmacyAdminDetail = {
  data: {
    name: string;
    email: string;
    phone: string;
  };
};

export type TFormAdminErr = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export type AllUsers = {
  data: {
    id: number;
    email: string;
    role: {
      id: number;
      name: string;
    };
    name: string;
    is_verified: string;
  }[];
  current_page: number;
  current_item: number;
  total_page: number;
  total_item: number;
};

export type DrugClassification = {
  id: number;
  name: string;
};

export type DrugForm = {
  id: number;
  name: string;
};

export type ProductData = {
  name: string;
  manufacture: string;
  detail: string;
  unit_in_pack: string;
  weight: string;
  height: string;
  length: string;
  width: string;
  image: File | null;
  product_category_id: number;
  is_hidden: boolean;
  selling_unit: string;
  price: string;
};

export type DrugData = {
  generic_name: string;
  drug_form_id: number;
  drug_classification_id: number;
  content: string;
};

export type Pharmacies = {
  data: {
    id: number;
    name: string;
    admin: {
      id: number;
      email: string;
      role_id: number;
      name: string;
      phone: string;
    };
    start_time: string;
    end_time: string;
    operational_day: string[];
    city: string;
    province: string;
  }[];
  current_page: number;
  current_item: number;
  total_page: number;
  total_item: number;
};

export type Provinces = {
  id: number;
  name: string;
  code: string;
  latitude: string;
  longitude: string;
};

export type TCities = {
  id: number;
  name: string;
  code: string;
  cities: Provinces[];
};

export type OrderList = {
  data: {
    id: number;
    order_items: {
      id: number;
      name: string;
      quantity: number;
      sub_total: number;
      image: string;
    }[];
    item_order: number;
    order_date: string;
    shipping_name: string;
    shipping_price: string;
    total_price: string;
    order_status: string;
    name: string;
  }[];
  current_page: number;
  current_item: number;
  total_page: number;
  total_item: number;
};

export type SalesReport = {
  data: {
    pharmacy_graph: {
      total_item: number;
      total_sales: number;
      month: string;
    }[];
    product_category_graph: {
      product_category_id: 1;
      total_item: number;
      total_sales: number;
      month: string;
    }[];
    product_graph: { total_item: number; total_sales: number; month: string }[];
  };
};

export type PharmacyGraph = {
  total_item: number;
  total_sales: number;
  month: string;
};

export type ProductCategoryGraph = {
  product_category_id: 1;
  total_item: number;
  total_sales: number;
  month: string;
};

export type ProductGraph = {
  total_item: number;
  total_sales: number;
  month: string;
};

export type SelectSearch = {
  value: string | number;
  label: string;
};

export type ProductPharmacy = {
  data: {
    id: number;
    product: {
      id: number;
      name: string;
      manufacture: string;
      product_category_id: number;
      detail: string;
      unit_in_pack: string;
      weight: string;
      height: string;
      length: string;
      width: string;
      image: string;
      is_hidden: boolean;
      price: string;
      selling_unit: string;
    };
    stock: number;
    price: string;
    is_active: boolean;
  }[];
  current_page: number;
  current_item: number;
  total_page: number;
  total_item: number;
};

export type ResponseError = {
  error: string;
};

export type BaseProductDetail = {
  data: {
    id: number;
    name: string;
    manufacture: string;
    product_category_id: number;
    detail: string;
    unit_in_pack: string;
    weight: string;
    height: string;
    length: string;
    width: string;
    image: string;
    is_hidden: boolean;
    price: string;
    selling_unit: string;
    generic_name: string;
    drug_form: string;
    drug_classification: string;
    content: string;
  };
};

export type ValidAddress = {
  data: {
    is_valid: boolean;
  };
};

export type StockMutationHistory = {
  data: {
    id: number;
    to_pharmacy_product: {
      id: number;
      name: string;
      image: string;
      pharmacy: {
        id: number;
        name: string;
      };
    };
    form_pharmacy_product: {
      id: number;
      name: string;
      image: string;
      pharmacy: {
        id: number;
        name: string;
      };
    };
    quantity: number;
    status: string;
    mutated_at: string;
    is_request: boolean;
  }[];
  current_page: number;
  current_item: number;
  total_page: number;
  total_item: number;
};

export type StockMutationDetail = {
  data: {
    id: number;
    to_pharmacy_product: {
      id: number;
      name: string;
      image: string;
      pharmacy: {
        id: number;
        name: string;
      };
    };
    form_pharmacy_product: {
      id: number;
      name: string;
      image: string;
      pharmacy: {
        id: number;
        name: string;
      };
    };
    quantity: number;
    status: string;
    mutated_at: string;
  };
};

export type PostTelemedicine = {
  data: {
    id: number;
    ordered_at: string;
    expired_at: string;
    status: string;
    total_payment: string;
    proof: string;
    sick_leave_pdf: string;
    prescription_pdf: string;
    profile: null;
    doctor: null;
  };
  message: string;
};

export type TelemedicineDetail = {
  data: {
    id: number;
    ordered_at: string;
    expired_at: string;
    status: string;
    total_payment: string;
    proof: string;
    sick_leave_pdf: string;
    prescription_pdf: string;
    profile: {
      name: string;
      image: string;
      birth_date: string;
    };
    doctor: {
      name: string;
      image: string;
    };
  };
};

export type Telemedicine = {
  data: {
    id: number;
    ordered_at: string;
    expired_at: string;
    status: string;
    total_payment: string;
    proof: string;
    sick_leave_pdf: string;
    prescription_pdf: string;
    profile: {
      name: string;
      image: string;
      birth_date: string;
    };
    doctor: {
      name: string;
      image: string;
    };
  }[];
  current_page: number;
  current_item: number;
  total_page: number;
  total_item: number;
};

export type TStockRecord = {
  data: {
    id: number;
    quantity: number;
    is_reduction: boolean;
    change_at: string;
    product: {
      id: number;
      name: string;
      category_name: string;
      image: string;
    };
    pharmacy_name: string;
  }[];
  current_page: number;
  current_item: number;
  total_page: number;
  total_item: number;
};

export type TPharmacies<T> = {
  data: T;
  current_page: number;
  current_item: number;
  total_page: number;
  total_item: number;
};

export type TPharmaciesData = {
  id: number;
  name: string;
  admin_id: number;
  address: string;
  city: {
    id: number;
    name: string;
    code: string;
  };
  province: {
    id: number;
    name: string;
    code: string;
  };
  latitude: string;
  longitude: string;
  start_time: string;
  end_time: string;
  operational_day: string[];
  pharmacist_license_number: string;
  pharmacist_phone_number: string;
};

export type TPharmaciesDetailForm = {
  name: string;
  address: string;
  city_id: number;
  province_id: number;
  latitude: string;
  longitude: string;
  start_time: string;
  end_time: string;
  operational_day: string[];
  pharmacist_license_number: string;
  pharmacist_phone_number: string;
};

export type TDoctor = {
  name: string;
  image: string;
  email: string;
  dob: string;
  yoe: number;
  fee: string;
  specialization: {
    id: number;
    name: string;
  };
  certificate: string;
  status: string;
};

export type StockRecordMonthly = {
  data: {
    additions: number;
    deductions: number;
    final_stock: number;
    month: string;
    pharmacy_name: string;
    product_name: string;
  }[];
  current_page: number;
  current_item: number;
  total_page: number;
  total_item: number;
};

export type TOrderDetail = {
  data: {
    id: string;
    order_items: {
      id: number;
      name: string;
      quantity: number;
      sub_total: string;
      image: string;
    }[];
    ordered_at: string;
    expired_at: string;
    order_status: string;
    product_price: string;
    shipping_name: string;
    shipping_price: string;
    shipping_eta: string;
    total_price: string;
    payment_proof: string;
    name: string;
    street: string;
    postal_code: string;
    phone: string;
    detail: string;
    province: string;
    city: string;
    pharmacy_contact: string;
    pharmacy_email: string;
  };
};
