// "use client";
// import React, { useEffect, useState } from "react";
// // import { toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// import { useRouter, useSearchParams } from "next/navigation";
// import { auth } from "@/firebase";
// import appConstant from "../../../../../public/json/appConstant.json";
// import useLanguage from "@/hooks/useLanguage";
// import { useAuth } from "@/context/AuthContext";
// import Link from "next/link";
// import PhoneInput from "react-phone-input-2";
// import 'react-phone-input-2/lib/style.css';
// import { useForm } from "react-hook-form";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { EyeSlash, Eye, Facebook, Google, Prev, Spinner } from "@/style/icons";
// import { Input } from "@/components/ui/input";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { decryptAccessToken } from "@/service/EncryptionUtil";
// import { jwtDecode } from "jwt-decode";
// import AuthApi from "@/api/auth/auth";
// import { deleteUser, updateProfile } from "firebase/auth";
// import SocialLogin from "../SocialLogin";
// import { useToast } from "@/components/ui/use-toast";
// import { useFcmContext } from "@/context/FcmContext";


// const SingUp = () => {
//   const {handleFirebaseAuthentication, handleFirebaseEmailVerification, Authentication, handleWelcomeMail }: any = AuthApi();
//   const { setUser }: any = useAuth();
//   const { toast } = useToast();

//   const [phoneNum, setPhoneNo] = useState("");
//   const [showPassword, setShowPassword] = useState(true);
//   const [confirmPassword, setConfirmPassword] = useState(true);
//   const [check, setChecked] = useState(false);
//   const [isLoading, setIsLoading]: any = useState(false);
//   const [signUpData, setSignUpData]: any = useState({});
//   const [image, setImage]: any = useState('');
//   const currentLanguageJson: any = useLanguage("en")
//   const { fcmToken }: any = useFcmContext();
//   const router = useRouter();

//   // const tokenLocalStorageKey: any = `${process.env.NEXT_PUBLIC_TOKEN}`;

//   const formSchema = z.object({
//     firstName: z.string().min(1, "First name is required.").min(2, "First name must be at least 2 characters."),
//     lastName: z.string().min(1, "Last name is required.").min(2, "Last name must be at least 2 characters."),
//     email: z.string().trim().min(1, "Email is required.").email("Please enter a valid email address."),
//     mobileNumber: z.string().optional(),
//       // .min(1, "Mobile number is required.")
//       // .min(8, "Mobile number should be at least 8 characters long."),
//     countryCode: z.string().optional(),
//     password: z.string().trim().min(1, "Password is required.").min(6, "Password must be at least 6 characters."),
//     confirmPassword: z.string().trim().min(1, "Confirm password is required.").min(6, "Confirm password must be at least 6 characters."),
//   }).refine((data) => data.password === data.confirmPassword, {
//     message: "The passwords must match.",
//     path: ["confirmPassword"]
//   });

//   const form:any = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema,),
//     defaultValues: {},
//   });

//   useEffect(() => {
//     const socialSignUp = localStorage.getItem(appConstant.NEXT_PUBLIC_GOOGLE_SIGN_UP);
//     if (socialSignUp) {
//       const decryptedData = decryptAccessToken(socialSignUp);
//       decryptedData.firstName = decryptedData?.name?.split(" ")[0];
//       decryptedData.lastName = decryptedData?.name?.split(" ")[1];
//       setSignUpData(decryptedData);

//       setTimeout(() => {
//         decryptedData?.firstName ? form.setValue("firstName", decryptedData?.firstName) : "";
//         decryptedData?.lastName ? form.setValue("lastName", decryptedData?.lastName) : "";
//         decryptedData?.email ? form.setValue("email", decryptedData?.email) : "";
//         decryptedData?.mobileNumber ? setPhoneNo(decryptedData?.mobileNumber) : "";
        
        
//         form.setValue("password", "password");
//         form.setValue("confirmPassword", "password");
//         setImage(decryptedData?.avatar);
//       }, 200);
//     }
//   }, [localStorage.getItem(`${appConstant.NEXT_PUBLIC_GOOGLE_SIGN_UP}`)]);

//   // useEffect(() => {
//   //   if (form?.formState?.isSubmitted && !signUpData?.accessToken) {
//   //     !form?.getValues("password") ? form.setError("password", { type: "required", message: "Password is required." }) : "";
//   //     !form?.getValues("confirmPassword") ? form?.control.setError("confirmPassword", { type: "required", message: "Confirm Password is required." }) : "";
//   //   }
//   // }, [form?.formState?.submitCount]);

//   // useEffect(() => {
//   //   if (cropperData?.isSubmit) {
//   //     uploadImage();
//   //   }
//   // }, [cropperData]);

//   const handleSignUp = async (data: any) => {
//     // router.push("/auth/verify-email")
//     if(signUpData?.accessToken ){
//       delete data?.password;
//       delete data?.confirmPassword;
//     }

//     if (check) {
//       console.log(data, "===sign");

//       setIsLoading(true);
//       data.image = image;
//       // data.userImage = userImage;
//       if (signUpData?.accessToken) {
//         data.accessToken = signUpData?.accessToken;
//         data.provider = signUpData?.provider;
//         signUp(data, signUpData);

//       } else {
//         handleFirebaseAuthentication(data).then(async (res: any) => {
//           if (!res?.error) {
//             const userCredential: any = res?.user;
//             signUp(data, userCredential);
//             await updateProfile(userCredential, { displayName: (data?.firstName || '') + " " + (data?.lastName || ''), photoURL: data?.image? data?.image : '' })
//           } else {
//             toast({
//               variant: "destructive",
//               title: currentLanguageJson?.AUTH?.EMAIL_EXISTS,
//             })
//             // toast.error(currentLanguageJson?.AUTH?.EMAIL_EXISTS);
//             setIsLoading(false);
//           }
//         });
//       }
//     }
//   };

//   const signUp = async (data: any, userCredential: any) => {
//     data.userToken = userCredential?.accessToken;
//     await Authentication({ ...data, accessToken: data?.userToken, notificationId: fcmToken }).then(async (response: any) => {
//       if (!response?.error) {
//         removeLocalStorage();
//         setUser(data);
//         await getFirebaseToken();
//         const token: any = data?.userToken ? jwtDecode(data?.userToken) : "";
//         if (token?.firebase?.sign_in_provider == "google.com" || token?.firebase?.sign_in_provider == "facebook.com") {
//           await handleWelcomeMail(auth?.currentUser)
//             .then(() => {
//               router.push("/complete-profile/group-type")
//             }).catch((error: any) => {
//               // toast.dismiss();
//               // toast.error(error.message);
//               toast({
//                 variant: "destructive",
//                 title: error.message,
//               });
//             });
//         } else {
//           await handleFirebaseEmailVerification();
//           router.push("/auth/verify-email");
//         }
//       } else {
//         auth?.currentUser && !data?.provider ? deleteUser(auth?.currentUser) : "";
//         // toast.dismiss()
//         // toast.error(response?.errorMessage);
//         toast({
//           variant: "destructive",
//           title: response?.errorMessage,
//         });
//         setIsLoading(false);
//       }
//     });

//   };

//   const removeLocalStorage = () => {
//     localStorage.removeItem(`${appConstant.NEXT_PUBLIC_GOOGLE_SIGN_UP}`);
//     localStorage.removeItem(`${appConstant.NEXT_PUBLIC_FACEBOOK_SIGN_UP}`);
//     // localStorage.removeItem(`${appConstant.NEXT_PUBLIC_USER_INTEREST}`);
//   };

//   const getFirebaseToken = async () => {
//     try {
//       localStorage.removeItem(`${appConstant?.NEXT_PUBLIC_ANONYMOUS_USER}`)
//       let verificationToken: any = await auth?.currentUser?.getIdToken(true);
//       // let encryptedData:any = encryptAccessToken({
//       //   accessToken: verificationToken
//       // });
//       // localStorage.setItem(tokenLocalStorageKey, encryptedData);
//     } catch (error) {
//       return null;
//     }
//   };
 
//   const handleFullNameInput = (e: any) => {
//     const inputValue = e.key || e.clipboardData.getData("text/plain");
//     const regex = /^[A-Za-z\s]+$/;
//     if (!regex.test(inputValue)) {
//       e.preventDefault();
//     }
//   };

//   const handleEmailInput = (e: any) => {
//     if (e?.keyCode === 32) {
//       e.preventDefault();
//     }
//   };

//   // const setValidationFocus = (field: string) => {
//   //   const id: any = document.getElementById(field);
//   //   id.scrollIntoView({ block: "center" });
//   //   id?.focus();
//   // }  

//   return (
//     <>
//       <div className=" max-w-[1122px] mx-auto py-10 lg:py-14 px-5 xl:px-0 min-h-[100vh] flex flex-col items-center justify-center">
//         <div className="flex items-center justify-between gap-2 w-full">
//           <button type="button" className="inline-flex items-center gap-1.5 lg:gap-2.5 py-2 lg:py-3 px-3 lg:px-[18px] border border-primary rounded-md font-bold text-base/none lg:text-lg/none"
//             onClick={() => { router.back() }}>
//             <Prev />Back
//           </button>
//           <h1 className="m-auto text-fc-primary text-[24px]/none sm:text-[28px]/none md:text-[34px] lg:text-5.5xl text-center  font-semibold whitespace-nowrap">Create Account</h1>
//         </div>
//         <div className="pt-5 lg:pt-14 w-full">

//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSignUp)}
//               className=""
//             >
//               {/* <div className={"_styles.upload_icon"}>
//           <input
//             type="file"
//             accept="image/*"
//             name="image"
//             id="image"
//             onChange={selectImage}
//           />
//         </div> */}
//               <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-5">
//                 <FormField
//                   control={form.control}
//                   name="firstName"
//                   render={({ field }) => (
//                     <FormItem className="bg-[#fff]">
//                       <FormLabel>First Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter First Name" {...form.register('firstName')}
//                           onKeyDown={handleFullNameInput}
//                           onPaste={handleFullNameInput}
//                           maxLength={30}
//                           autoFocus
//                           className="caret-primary font-semibold  rounded-none text-lg/none lg:text-xl.5/none !outline-none placeholder:text-fc-secondary w-full border-b border-b-[#00000000] transition-[border-color] duration-300 hover:border-primary focus:border-primary" />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="lastName"
//                   render={({ field }) => (
//                     <FormItem className="bg-[#fff]">
//                       <FormLabel>Last Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter Last Name" {...form.register('lastName')} 
//                         onKeyDown={handleFullNameInput}
//                         onPaste={handleFullNameInput}
//                         maxLength={30}
//                         className="caret-primary font-semibold  rounded-none ext-lg/none lg:text-xl.5/none !outline-none placeholder:text-fc-secondary w-full border-b border-b-[#00000000] transition-[border-color] duration-300 hover:border-primary focus:border-primary" />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="mobileNumber"
//                   render={({ field: { onChange, onBlur, value }, fieldState }) => (
//                     <FormItem className="bg-[#fff]">
//                       <FormLabel className="block leading-[1.188] mb-1 sm:mb-[6px]">Mobile Number</FormLabel>
//                       <FormControl>
//                         <PhoneInput
//                           inputClass="!h-[26px] !w-full !rounded-none !text-lg/none lg:!text-xl.5 font-semibold text-fc-primary caret-primary !outline-none placeholder:text-fc-secondary w-full !border-t-0 !border-l-0 !border-r-0 !border-[transparent] transition-[border-color] duration-300 hover:!border-primary focus:!border-primary mt-0 !leading-[1.182]"
//                           dropdownClass="border-8 border-[white] !p-1 shadow-[0px_4px_14px_0px_#00000026] flex flex-col gap-2 !rounded-2xl [&_.country]:!p-2 [&_.country]:rounded-lg [&_.country]:leading-none [&_.country]:font-semibold [&_.highlight]:!bg-primary [&_.highlight>*]:!text-[white]"
//                           buttonClass="!border-t-0 !border-l-0 !border-b-0 !border-theme-border !bg-[transparent] [&_.selected-flag]:!bg-[transparent]"
//                           country={'us'}
//                           value={phoneNum}
//                           onEnterKeyPress={form.handleSubmit(handleSignUp)}
//                           onChange={(value, country: any) => {
//                             onChange(value.slice(country?.dialCode?.length, value.length));
//                             setPhoneNo(value);
//                             form.setValue("countryCode", country?.dialCode);
//                           }}
//                         />
//                       </FormControl>
//                       {/* <FormMessage /> */}
//                       <FormMessage>{fieldState.error?.message}</FormMessage>
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                    <FormItem className="bg-[#fff]">
//                       <FormLabel>Email</FormLabel>
//                       <FormControl>
//                         <Input disabled={signUpData?.email} placeholder="Enter Email" {...form.register('email')} className="caret-primary font-semibold  rounded-none ext-lg/none lg:text-xl.5/none !outline-none placeholder:text-fc-secondary w-full border-b border-b-[#00000000] transition-[border-color] duration-300 hover:border-primary focus:border-primary" />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {!signUpData?.accessToken && <>
//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem className="bg-[#fff] p-3 lg:p-6 flex items-center gap-1">
//                       <div className="shrink-0 grow basis-[0%]">
//                         <FormLabel>Password</FormLabel>
//                         <FormControl>
//                           <Input className="caret-primary font-semibold  rounded-none text-lg lg:text-xl.5 !outline-none placeholder:text-fc-secondary w-full border-b border-b-[#00000000] transition-[border-color] duration-300 hover:border-primary focus:border-primary min-w-28 lg:min-w-auto"
//                             type={showPassword ? "password" : "text"}
//                             placeholder={currentLanguageJson?.AUTH?.SIGN_UP_FORM?.PASSWORD_PLACEHOLDER}
//                             {...form.register('password')} maxLength={30}
//                             autoComplete="off" aria-autocomplete="none"
//                           />
//                         </FormControl>
//                       </div>
//                       <div
//                         className="cursor-pointer"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? <EyeSlash /> : <Eye />}
//                       </div>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                   <FormField
//                     control={form.control}
//                     name="confirmPassword"
//                     render={({ field: { onChange, onBlur, value }, fieldState }) => (
//                       <FormItem className="bg-[#fff] p-3 lg:p-6 flex items-center gap-1">
//                         <div className="shrink-0 grow basis-[0%]">
//                           <FormLabel>Confirm Password</FormLabel>
//                           <FormControl>
//                             <Input className="caret-primary font-semibold  rounded-none text-lg lg:text-xl.5 !outline-none placeholder:text-fc-secondary w-full border-b border-b-[#00000000] transition-[border-color] duration-300 hover:border-primary focus:border-primary min-w-28 lg:min-w-auto"
//                               type={confirmPassword ? "password" : "text"}
//                               placeholder={currentLanguageJson?.AUTH?.SIGN_UP_FORM?.CONFIRM_PLACEHOLDER}
//                               {...form.register('confirmPassword')} maxLength={30}
//                             />
//                           </FormControl>
//                         </div>
//                         <div
//                           className="cursor-pointer"
//                           onClick={() => setConfirmPassword(!confirmPassword)}
//                         >
//                           {confirmPassword ? <EyeSlash /> : <Eye />}
//                         </div>
//                         <FormMessage>{fieldState.error?.message}</FormMessage>
//                       </FormItem>
//                     )}
//                   />
//                 </>}

//               </div>
//               {/* <FormField
//                 control={form.control}
//                 name="termsConditions"
//                 render={({ field }) => (
//                   <FormItem >
//                     <FormControl>
//                       <Input type="checkbox" disabled={isLoading == "login"} placeholder="Enter Email" {...form.register('termsConditions')} className="caret-primary font-semibold  rounded-none text-lg md:text-xl.5 !outline-none placeholder:text-fc-secondary w-full border-b border-b-[#00000000] transition-[border-color] duration-300 hover:border-primary focus:border-primary" />
//                     </FormControl>
//                     <FormLabel className="flex items-center mb-0 select-none"><span className="ms-2 text-lg font-normal ">
//                       {"I agree to the "}
//                       <Link className="text-primary capitalize" href={"/auth/terms-&-conditions"}>
//                         Terms & Conditions
//                       </Link>
//                     </span>
//                     </FormLabel>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               /> */}
//               <div className="flex items-center mt-4 lg:mt-3  mb-4 lg:mb-5 justify-center">
//                 <div className="relative">
//                   <label className="flex items-center mb-0 select-none">
//                     <input type="checkbox" disabled={isLoading == "login"} name="termsConditions" id="termsConditions"
//                       onChange={(e) => {
//                         setChecked(e?.target?.checked);
//                       }}
//                       className="appearance-none h-[23px] w-[23px] border !border-theme-border rounded-md bg-[#fff] checked:bg-[url('/images/check.svg')] checked:border-none" />
//                     <span className="ms-2 text-base md:text-lg font-normal whitespace-nowrap">
//                       {"I agree to the "}
//                       <Link className="text-primary capitalize" target="_blank" href="https://app.termly.io/policy-viewer/policy.html?policyUUID=57a30cf9-0581-41e5-a549-bd7a90a4bcba">
//                         Terms & Conditions
//                       </Link>
//                     </span>
//                   </label>
//                   {!check && form?.formState?.isSubmitted && <p className="text-sm font-medium text-fc-danger absolute inset-y-full left-0">{currentLanguageJson?.AUTH?.SIGN_UP_FORM?.SELECT_TERMS_CONDITIONS}</p>}
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className={`max-w-[370px] md:max-w-[484px] mx-auto block btn btn-theme w-full btn_lg  bg-primary border-primary rounded-xl text-[#fff] p-2 md:p-4 text-base md:text-lg font-bold ${isLoading && 'cursor-not-allowed'} `}
//                 disabled={isLoading}>
//                 {isLoading ? (
//                   <span className="flex justify-center"><Spinner className="animate-spin size-6 md:size-[28px]" /></span>
//                 ) : (
//                   `${"Continue"}`
//                 )}
//               </button>

//               <p className="text-center  pt-5 lg:py-10 text-[#000000B2] font-normal text-base md:text-lg">
//                 {currentLanguageJson?.AUTH?.OTHER_HEADINGS?.ALREADY_HAVE_ACCOUNT}{" "}
//                 <Link className="text-fc-primary font-medium text-lg" href={"/auth/login"}><b>{currentLanguageJson?.AUTH?.LOGIN_FORM?.HEADING}</b></Link>
//               </p>

//               <div className="flex items-center gap-4 mb-4 lg:mb-7">
//                 <hr className="w-full border-theme-border" />
//                 <p className=" text-fc-primary text-center text-text-xl.5 font-normal">Or</p>
//                 <hr className="w-full border-theme-border" />
//               </div>

//               {!signUpData?.accessToken && <>
//               <SocialLogin loader={isLoading} setLoader={setIsLoading}/>
//               </>}
//             </form>
//           </Form>
//         </div>
//       </div>
//     </>
//   )
// }

// export default SingUp