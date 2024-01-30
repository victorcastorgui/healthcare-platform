import { useEffect, useState } from "react";
import Head from "next/head";
import Button from "@/components/Button/Button";
import CardAddress from "@/components/Address/CardAddress";
import Spinner from "@/components/Loading/Spinner";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { TAddress, TData, TUser } from "@/types";
import Profile from "@/components/Profile/Profile";
import ProfileForm from "@/components/Profile/ProfileForm";
import { useFetch } from "@/hooks/useFetch";
import { getToken } from "@/utils/token";
import FormAddress from "@/components/Address/FormAddress";
import { toast } from "sonner";
import EditAddress from "@/components/Address/EditAddress";
import FormChangePass from "@/components/Profile/FormChangePass";

const UserProfile = () => {
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isAddAddress, setIsAddAddress] = useState(false);
  const [isProfile, setIsProfile] = useState(true);
  const [editAddress, setEditAddress] = useState<TAddress | null>(null);
  const user = useCustomSWR<TUser>(`${apiBaseUrl}/users/profile`);
  const address = useCustomSWR<TData<TAddress[]>>(`${apiBaseUrl}/addresses`);
  const { data: dataDelete, fetchData: deleteAddress } = useFetch();
  const { fetchData: updateMainAddress } = useFetch();
  const token = getToken();

  useEffect(() => {
    if (dataDelete) {
      toast.success("Delete address success!");
    }
  }, [dataDelete]);

  const handleDeleteAddress = async (id: number) => {
    await deleteAddress(`${apiBaseUrl}/addresses/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    address.mutate();
  };

  const handleMainAddress = async (id: number) => {
    await updateMainAddress(`${apiBaseUrl}/addresses/${id}/default`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    address.mutate();
  };

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <div className="pt-24 pb-14 bg-[url('https://everhealth-asset.irfancen.com/assets/background.png')] bg-cover min-h-screen">
        <div
          role="tablist"
          className="tabs tabs-lg tabs-lifted w-11/12 md:w-4/5 max-w-screen-xl m-auto mt-16 grid-cols-[1fr_auto_auto_1fr]"
        >
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab disabled:!cursor-default"
            aria-label=""
            disabled
          />

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab text-xl font-semibold"
            aria-label="Profile"
            checked={isProfile}
            onChange={() => setIsProfile(true)}
          />

          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            {user.error && (
              <div>Error getting the data, please refresh the page</div>
            )}
            {user.isLoading && <Spinner />}
            {user.data &&
              (!isEditProfile ? (
                <Profile
                  user={user.data}
                  setIsEditProfile={setIsEditProfile}
                  setIsChangePass={setIsChangePassword}
                />
              ) : !isChangePassword ? (
                <ProfileForm
                  user={user.data}
                  setIsEditProfile={setIsEditProfile}
                />
              ) : (
                <FormChangePass
                  setIsEditProfile={setIsEditProfile}
                  setIsChangePass={setIsChangePassword}
                />
              ))}
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab text-xl font-semibold"
            aria-label="Address"
            checked={!isProfile}
            onChange={() => setIsProfile(false)}
          />

          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            {address.error && (
              <div>Error getting the data, please refresh the page</div>
            )}
            {address.isLoading && <Spinner />}
            {address.data &&
              (!isAddAddress ? (
                <section className="flex flex-col">
                  <div className="max-w-fit self-end">
                    <Button
                      variants="secondary"
                      onClick={() => setIsAddAddress(true)}
                    >
                      + Add Address
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-3 p-4 max-h-[500px] overflow-y-auto scrollbar-custom">
                    {address.data &&
                    address.data.data !== null &&
                    address.data.data !== undefined &&
                    address.data.data.length > 0 ? (
                      address.data.data.map((val, i) => {
                        return (
                          <CardAddress
                            key={`address-${i}`}
                            address={val}
                            handleDelete={handleDeleteAddress}
                            handleMainAddress={handleMainAddress}
                            setIsAddAddress={setIsAddAddress}
                            setNewAddress={setEditAddress}
                          />
                        );
                      })
                    ) : (
                      <div className="py-10 text-center">
                        You don&apos;t have address. Please add a new address
                      </div>
                    )}
                  </div>
                </section>
              ) : (
                <section className="p-4">
                  {!editAddress ? (
                    <>
                      <div className="font-bold text-2xl">Add Address</div>
                      <FormAddress
                        initialState={{
                          name: "",
                          street: "",
                          postal_code: "",
                          phone: "",
                          detail: "",
                          latitude: "-6.2304177",
                          longitude: "106.8236458",
                          province_id: 0,
                          city_id: 0,
                          is_default: false,
                        }}
                        setBack={() => setIsAddAddress(false)}
                      />
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-2xl">Edit Address</div>
                      <EditAddress
                        setBack={() => setIsAddAddress(false)}
                        initialAddress={editAddress}
                        setEditAddress={setEditAddress}
                      />
                    </>
                  )}
                </section>
              ))}
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab disabled:!cursor-default"
            aria-label=""
            disabled
          />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
