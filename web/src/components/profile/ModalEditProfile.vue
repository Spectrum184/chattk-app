<template>
    <button
        class="px-2 py-2 bg-emerald-500 rounded-md hover:opacity-80 flex"
        @click="setOpenModal(true)"
    >
        <CogIcon class="w-6 h-6" /> {{ $t("userInfoPage.editProfile") }}
    </button>
    <TransitionRoot appear :show="isOpenModal" as="template">
        <Dialog as="div" @close="setOpenModal(false)" class="relative z-10">
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div
                    class="flex min-h-full items-center justify-center p-4 text-center"
                >
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel
                            class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                        >
                            <DialogTitle
                                as="h3"
                                class="text-lg font-medium leading-6 text-gray-900"
                            >
                                {{ $t("userInfoPage.editProfile") }}
                            </DialogTitle>
                            <div class="mt-2 md:min-w-[600px]">
                                <FormKit
                                    type="form"
                                    id="formUpdateProfile"
                                    :action="false"
                                    @submit="updateProfile"
                                    message-class="text-rose-400"
                                >
                                    <div
                                        class="grid gap-4 md:grid-cols-2 grid-cols-1"
                                    >
                                        <FormKit
                                            type="text"
                                            name="firstName"
                                            :label="
                                                $t('userInfoPage.firstName')
                                            "
                                            validation="required:trim|length:1,100"
                                            :validation-messages="{
                                                required: $t(
                                                    'userInfoPage.validateLengthName'
                                                ),
                                                length: $t(
                                                    'userInfoPage.validateLengthName'
                                                ),
                                            }"
                                            :placeholder="
                                                $t(
                                                    'userInfoPage.enterFirstName'
                                                )
                                            "
                                            label-class="text-md text-black"
                                            input-class="relative w-full p-2 transition rounded outline-none border border-slate-300 bg-slate-100 focus:ring-1 focus:ring-emerald-500 text-black"
                                            message-class="text-rose-400"
                                            help-class="text-gray-400"
                                            :value="
                                                userInfoStore.getUserInfo
                                                    .firstName || ''
                                            "
                                        />
                                        <FormKit
                                            type="text"
                                            name="lastName"
                                            :label="$t('userInfoPage.lastName')"
                                            validation="required:trim|length:1,100"
                                            :validation-messages="{
                                                required: $t(
                                                    'userInfoPage.validateLengthName'
                                                ),
                                                length: $t(
                                                    'userInfoPage.validateLengthName'
                                                ),
                                            }"
                                            :placeholder="
                                                $t('userInfoPage.enterLastName')
                                            "
                                            label-class="text-md text-black"
                                            input-class="w-full p-2 transition rounded outline-none border border-slate-300 bg-slate-100 focus:ring-1 focus:ring-emerald-500 text-black"
                                            message-class="text-rose-400"
                                            help-class="text-gray-400"
                                            :value="
                                                userInfoStore.getUserInfo
                                                    .lastName || ''
                                            "
                                        />
                                        <FormKit
                                            type="text"
                                            name="phone"
                                            :label="$t('userInfoPage.phone')"
                                            validation="matches:/^\d{3}-\d{3}-\d{4}$/"
                                            :validation-messages="{
                                                matches: $t(
                                                    'userInfoPage.validatePhone'
                                                ),
                                            }"
                                            placeholder="xxx-xxx-xxxx"
                                            label-class="text-md text-black"
                                            input-class="relative w-full p-2 transition rounded outline-none border border-slate-300 bg-slate-100 focus:ring-1 focus:ring-emerald-500 text-black"
                                            message-class="text-rose-400"
                                            help-class="text-gray-400"
                                            :value="
                                                userInfoStore.getUserInfo
                                                    .phone || ''
                                            "
                                        />
                                        <FormKit
                                            type="date"
                                            name="birthday"
                                            :label="$t('userInfoPage.birthday')"
                                            validation="before:2015-01-01"
                                            :validation-messages="{
                                                before: $t(
                                                    'userInfoPage.validateBirthday'
                                                ),
                                            }"
                                            :placeholder="
                                                $t('userInfoPage.enterBirthday')
                                            "
                                            label-class="text-md text-black"
                                            input-class="w-full p-2 transition rounded outline-none border border-slate-300 bg-slate-100 focus:ring-1 focus:ring-emerald-500 text-black"
                                            message-class="text-rose-400"
                                            help-class="text-gray-400"
                                            :value="
                                                userInfoStore.getUserInfo
                                                    .birthday || ''
                                            "
                                        />
                                        <FormKit
                                            type="url"
                                            name="facebook"
                                            label="Facebook"
                                            validation="length:0,200|url"
                                            :validation-messages="{
                                                length: $t(
                                                    'userInfoPage.validateSocial'
                                                ),
                                                url: $t('userInfoPage.url'),
                                            }"
                                            placeholder="Facebook"
                                            label-class="text-md text-black"
                                            input-class="relative w-full p-2 transition rounded outline-none border border-slate-300 bg-slate-100 focus:ring-1 focus:ring-emerald-500 text-black"
                                            message-class="text-rose-400"
                                            help-class="text-gray-400"
                                            :value="
                                                userInfoStore.getUserInfo
                                                    .facebook || ''
                                            "
                                        />
                                        <FormKit
                                            type="url"
                                            name="twitter"
                                            label="Twitter"
                                            validation="length:0,200|url"
                                            :validation-messages="{
                                                length: $t(
                                                    'userInfoPage.validateSocial'
                                                ),
                                                url: $t('userInfoPage.url'),
                                            }"
                                            placeholder="Twitter"
                                            label-class="text-md text-black"
                                            input-class="w-full p-2 transition rounded outline-none border border-slate-300 bg-slate-100 focus:ring-1 focus:ring-emerald-500 text-black"
                                            message-class="text-rose-400"
                                            help-class="text-gray-400"
                                            :value="
                                                userInfoStore.getUserInfo
                                                    .twitter || ''
                                            "
                                        />
                                        <FormKit
                                            type="text"
                                            name="address"
                                            :label="$t('userInfoPage.address')"
                                            validation="length:0,200"
                                            :validation-messages="{
                                                length: $t(
                                                    'userInfoPage.validateSocial'
                                                ),
                                            }"
                                            :placeholder="
                                                $t('userInfoPage.address')
                                            "
                                            label-class="text-md text-black"
                                            input-class="w-full p-2 transition rounded outline-none border border-slate-300 bg-slate-100 focus:ring-1 focus:ring-emerald-500 text-black"
                                            message-class="text-rose-400"
                                            help-class="text-gray-400"
                                            :value="
                                                userInfoStore.getUserInfo
                                                    .address || ''
                                            "
                                        />
                                        <FormKit
                                            type="select"
                                            :label="$t('userInfoPage.sex')"
                                            name="sex"
                                            label-class="text-md text-black"
                                            input-class="w-full p-2 transition rounded outline-none border border-slate-300 bg-slate-100 focus:ring-1 focus:ring-emerald-500 text-black"
                                            :options="[
                                                {
                                                    label: $t(
                                                        'userInfoPage.male'
                                                    ),
                                                    value: 'male',
                                                },
                                                {
                                                    label: $t(
                                                        'userInfoPage.female'
                                                    ),
                                                    value: 'female',
                                                },
                                                {
                                                    label: $t(
                                                        'userInfoPage.other'
                                                    ),
                                                    value: 'other',
                                                },
                                            ]"
                                            :value="
                                                userInfoStore.getUserInfo.sex ||
                                                'male'
                                            "
                                        />
                                    </div>
                                    <div class="my-4">
                                        <FormKit
                                            type="textarea"
                                            name="bio"
                                            :label="$t('userInfoPage.bio')"
                                            validation="length:0,200"
                                            :validation-messages="{
                                                length: $t(
                                                    'userInfoPage.validateBio'
                                                ),
                                            }"
                                            :placeholder="
                                                $t('userInfoPage.enterBio')
                                            "
                                            label-class="text-md text-black"
                                            input-class="w-full p-2 transition rounded outline-none border border-slate-300 bg-slate-100 focus:ring-1 focus:ring-emerald-500 text-black"
                                            message-class="text-rose-400"
                                            help-class="text-gray-400"
                                            rows="4"
                                            :value="
                                                userInfoStore.getUserInfo.bio ||
                                                ''
                                            "
                                        />
                                    </div>
                                    <FormKit
                                        type="checkbox"
                                        name="isShow"
                                        :label="$t('userInfoPage.isShow')"
                                        label-class="text-md text-black"
                                        :value="
                                            userInfoStore.getUserInfo.isShow
                                        "
                                        input-class="w-4 h-4 mr-2"
                                        wrapper-class="flex items-center"
                                    />
                                    <p
                                        class="text-rose-500 text-xs italic my-2"
                                    >
                                        {{ $t("userInfoPage.security") }}
                                    </p>
                                    <div
                                        class="flex justify-center items-center border-t pt-4 mt-4 gap-6 border-slate-800"
                                    >
                                        <button
                                            type="button"
                                            class="inline-flex justify-center rounded px-4 py-2 text-sm h-9 font-medium bg-rose-500"
                                            @click="setOpenModal(false)"
                                        >
                                            {{ $t("cancel") }}
                                        </button>
                                        <FormKit
                                            type="submit"
                                            :disabled="isFormSubmitting"
                                            wrapper-class="text-center bg-emerald-500 rounded hover:bg-emerald-600 transition h-9 hover:cursor-pointer"
                                            input-class="font-semibold p-2 outline-none focus:ring-2 rounded"
                                        >
                                            <button>
                                                {{ $t("userInfoPage.save") }}
                                            </button>
                                        </FormKit>
                                    </div>
                                </FormKit>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
<script setup>
import { ref } from "vue";
import { useUserInfoStore } from "@/stores/infoUser";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
} from "@headlessui/vue";
import { CogIcon } from "@heroicons/vue/solid";
import { FormKit, clearErrors, setErrors } from "@formkit/vue";

const userInfoStore = useUserInfoStore();
const isOpenModal = ref(false);
const isFormSubmitting = ref(false);
const sexOption = [
    { label: "male", value: "male" },
    { label: "female", value: "female" },
    { label: "other", value: "other" },
];

function setOpenModal(value) {
    isOpenModal.value = value;
}

async function updateProfile(userInfo) {
    isFormSubmitting.value = true;
    clearErrors("formUpdateProfile");
    userInfoStore
        .saveUserInfo(userInfo)
        .then((message) => {
            if (message.ok) {
                isOpenModal.value = false;
            } else {
                setErrors("formUpdateProfile", [`${message}`]);
            }
        })
        .finally(() => {
            isFormSubmitting.value = false;
        });
}
</script>
