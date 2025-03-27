import { Rule } from 'antd/es/form';

export const usernameValidate: Rule[] = [
  { required: true, message: 'Please input your username!' },
  { pattern: /^[a-z0-9]+$/g, message: 'Username must contain lowercase alphanumerics only!' },
  { min: 3, message: 'Username must contain at least 3 characters' }
];

export const emailValidate: Rule[] = [
  { type: 'email', message: 'Invalid email address!' },
  { required: true, message: 'Please input your email address!' }
];

export const passwordValidate: Rule[] = [
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d]).{8,}$/g,
    message: 'Password must have at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character.'
  },
  { required: true, message: 'Please enter your password!' }
];

export const usernameLogin: Rule[] = [{ required: true, message: 'Email/Username is missing' }];

export const passwordLogin: Rule[] = [{ required: true, message: 'Please enter your password!' }];

export const confirmPassword: Rule[] = [
  { required: true, message: 'Please enter confirm password!' },
  {
    // eslint-disable-next-line consistent-return
    validator: (rule, value, callback) => {
      const passwordInput = document.querySelector('#password') as HTMLInputElement | null;
      if (!passwordInput) {
        return callback('Password field not found.');
      }
      const password = passwordInput.value;
      if (!value || value === password) {
        callback();
      } else {
        callback('Passwords do not match!');
      }
    }
  }
];

export const password: Rule[] = [
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d]).{8,}$/,
    message: 'Password must have at least 8 characters, including 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character.'
  }
];

export const firstNameValidate: Rule[] = [
  { required: true, message: 'Please input your first name!' },
  { pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u, message: 'First name cannot contain numbers or invalid characters.' }
];

export const lastNameValidate: Rule[] = [
  { required: true, message: 'Please input your last name!' },
  { pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u, message: 'Last name cannot contain numbers or invalid characters.' }
];

export const nameValidate: Rule[] = [
  { required: true, message: 'Please input your display name!' },
  { pattern: /^(?=.*\S).+$/g, message: 'Display name cannot contain only whitespace' },
  { min: 3, message: 'Display name must contain at least 3 characters' }
];

export const dateOfBirth: Rule[] = [{ required: true, message: 'Please select your date of birth.' }];

export const gender: Rule[] = [{ required: true, message: 'Please select your gender.' }];

export const contactName: Rule[] = [{ required: true, message: 'Tell us your full name.' }];

export const contactEmail: Rule[] = [
  { type: 'email', message: 'Invalid email format.' },
  { required: true, message: 'Tell us your email address.' }
];
export const contactMessage: Rule[] = [
  { required: true, message: 'What can we help you with?' },
  { min: 20, message: 'Please input at least 20 characters.' }
];
export const addressName: Rule[] = [{ required: true, message: 'Please enter address name!' }];

export const deliveryAddress: Rule[] = [{ required: true, message: 'Please select a delivery address!' }];

export const city: Rule[] = [{ required: true, message: 'Please select your city!' }];

export const country: Rule[] = [{ required: true, message: 'Please select your country!' }];

export const district: Rule[] = [{ required: true, message: 'Please enter your district!' }];

export const status: Rule[] = [{ required: true, message: 'Please select status!' }];

export const state: Rule[] = [{ required: true, message: 'Please select your state!' }];

export const stressAddress: Rule[] = [{ required: true, message: 'Please enter your street address!' }];

export const stressNumber: Rule[] = [{ required: true, message: 'Please enter your street number!' }];

export const ward: Rule[] = [{ required: true, message: 'Please enter your ward!' }];

export const zipCode: Rule[] = [
  { required: true, message: 'Please provide your zip code.' },
  { pattern: /^\d{2,10}$/g, message: 'Please provide valid zip code numbers.' }
];
export const walletAmount: Rule[] = [{ required: true, message: 'Please add your top-up amount!' }];

export const bankAccount: Rule[] = [{ required: true, message: 'Please input your bank account!' }];

export const bankName: Rule[] = [{ required: true, message: 'Please input your bank name!' }];

export const firstNameBankForm: Rule[] = [{ required: true, message: 'Please input your first name!' }];

export const lastNameBankForm: Rule[] = [{ required: true, message: 'Please input your last name!' }];

export const paymentCard: Rule[] = [{ required: true, message: 'Please choose your payment card!' }];

export const price: Rule[] = [{ required: true, message: 'Please input the price!' }];

export const productName: Rule[] = [{ required: true, message: 'Please input product name!' }];

export const productPrice: Rule[] = [{ required: true, message: 'Price is required!' }];

export const confirmQuantity: Rule[] = [{ required: true, message: 'Please input quantity of product!' }];

export const stock: Rule[] = [{ required: true, message: 'Stock is required!' }];

export const type: Rule[] = [{ required: true, message: 'Please select a type!' }];

export const streamTitle: Rule[] = [{ required: true, message: 'Please enter stream title!' }];

export const streamDescription: Rule[] = [{ required: true, message: 'Please enter stream description!' }];

export const streamOption: Rule[] = [{ required: true, message: 'Please select an option!' }];

export const titleGallery: Rule[] = [{ required: true, message: 'Please input gallery title!' }];

export const titleVideo: Rule[] = [{ required: true, message: 'Please input video title!' }];

export const description: Rule[] = [{ required: true, message: 'Please add a description!' }];

export const bio: Rule[] = [{ required: true, message: 'Please enter your bio!' }];

export const reason: Rule[] = [{ required: true, message: 'Tell us your reason!' }];

export const title: Rule[] = [{ required: true, message: 'Please select title!' }];

export const phoneNumber: Rule[] = [
  { required: true, message: 'Please enter your phone number!' },
  {
    // eslint-disable-next-line prefer-regex-literals
    pattern: new RegExp(/^([+]\d{2,4})?\d{9,12}$/g), message: 'Please provide valid digit numbers'
  }

];
