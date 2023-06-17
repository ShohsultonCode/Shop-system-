import { Types } from "mongoose";
export enum UserRole {
  User = 'user',
  Admin = 'admin',
  Seller = 'seller',
}

export interface User extends Document {
  id: string;
  user_first_name: string;
  user_last_name: string;
  user_username: string;
  user_password: string;
  user_categories: {
    id: string;
    category: string;
    category_status: boolean;
  }[],
  user_location: string;
  user_description: string;
  user_role: UserRole;
  user_image: string;
  user_payment: number;
  user_last_login_date: Date;
  user_isactive: boolean;
}

export interface Benefit extends Document {
  benefit: string;
}
export interface Category extends Document {
  category_name: string;
  category_status: boolean;
}

export interface UserCategory extends Document {
  category: string;
  category_status: boolean;
}

export interface Product extends Document {
  id: string,
  product_name: string;
  product_description: string;
  product_image: string;
  product_count: number;
  product_category: {
    id: string;
    category_name: string;
    category_status: boolean;
  };
  product_price: number;
  product_like: string[];
  product_save: string[];
  product_status: boolean;
}

export interface Like extends Document {
  like_user: string;
  like_product: string;
}
export interface Save extends Document {
  save_user: string;
  save_product: string;
}
export interface Sells extends Document {
  sell_user: string;
  sell_product: {
    id: string,
    product_name: string;
    product_description: string;
    product_image: string;
    product_count: number;
    product_category: {
      id: string;
      category_name: string;
      category_status: boolean;
    };
    product_price: number;
    product_like: string[];
    product_save: string[];
    product_status: boolean;
  };
  sell_price: number;
  sell_product_count: number;
}
export interface Carts extends Document {
  cart_user: string;
  cart_product: {
    id: string,
    product_name: string;
    product_description: string;
    product_image: string;
    product_count: number;
    product_category: {
      id: string;
      category_name: string;
      category_status: boolean;
    };
    product_price: number;
    product_like: string[];
    product_save: string[];
    product_status: boolean;
  };
  cart_product_count: number;
}