"use client";

import { Button } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { ConnectAdAccount } from "../_services/adAccountService";
import { Toast } from 'primereact/toast';
import Cookies from 'universal-cookie';

const app_id = process.env.FACEBOOK_ID;

const AccountLogin: React.FC = () => {
  const cookies = new Cookies();

  useEffect(() => {
    const loadFacebookSDK = () => {
      const fbScript = document.createElement("script");
      fbScript.id = "facebook-jssdk";
      fbScript.src = "https://connect.facebook.net/en_US/sdk.js";
      document.getElementsByTagName("head")[0].appendChild(fbScript);

      fbScript.onload = () => {
        window.fbAsyncInit = () => {
          window.FB?.init({
            appId: "733989884793288",
            cookie: true,
            xfbml: true,
            version: "v18.0",
          });
        };
      };
    };
    loadFacebookSDK();
  }, []);
const toast = useRef<Toast>(null);

 const showSuccessToast = (message: string) => {
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000,
    });
  };

  const showErrorToast = (message: string) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error Message',
      detail: message,
      life: 3000,
    });
  };

  const adAccount = async (accessToken: string) => {
    try {
      const backendResponse = await ConnectAdAccount(accessToken);
      console.log("check2",backendResponse);
      if (backendResponse.statusCode == "200") {
        console.log("check",backendResponse.responseData.longLiveToken);
        // if (typeof window !== 'undefined') {
          // Set a value in localStorage
          localStorage.setItem('accesstoken2', backendResponse.responseData.longLiveToken);
        // }

        cookies.set('accesstoken', backendResponse.responseData.longLiveToken);
        cookies.set('adAccountId', backendResponse.responseData.adAccountId);
        showSuccessToast(backendResponse.message);
        showSuccessToast('Ad Account Connected successfully')
       } 
      else{
        showErrorToast(backendResponse.message);
      }      
    } catch (error) {
      showErrorToast('Could not connect ad account');
    }
  }

  const fblogin = () => {
    window.FB.login(
      (response: any) => {
        if (response.status === "connected") {
          console.log(response.authResponse.accessToken);
          adAccount(response.authResponse.accessToken);

          fetch(`/api/fblogin?token=${response.authResponse.accessToken}`).then(
            (response2) => console.log("Debug response: ", response2)
          );
          console.log("Response by Facebook Login: ", response);
        }
      },
      {
        scope:
          "email, read_insights, pages_show_list, ads_management, ads_read, business_management, pages_read_engagement,pages_manage_posts",
      }
    );
  };

  return (
    <>
      <Button
        onClick={fblogin}
        variant="contained"
        sx={{
          backgroundColor: "#597FB5 !important",
          color: "#fff !important",
          "&:hover": {
            backgroundColor: "#405D80 !important",
          },
        }}
      >
        {" "}
        Connect Ad Account
      </Button>
    </>
  );
};

export default AccountLogin;