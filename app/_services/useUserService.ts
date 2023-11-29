import { create } from 'zustand';
import { useRouter, useSearchParams } from 'next/navigation';
import useFetch from '../_helpers/useFetch';
// import {IUserStore, IUser} from '../_store/userStore';
// import User from '../_models/user.model'

export { useUserService };

// user state store
const initialState = {
    users: undefined,
    user: undefined,
    currentUser: undefined
};
const userStore = create<IUserStore>(() => initialState);

function useUserService(): IUserService {
    const fetch = useFetch();
    const router = useRouter();
    const searchParams = useSearchParams();
    // const userModel = User();
    const { users, user, currentUser} = userStore();
    // const user = userStore( (state) => state.user);
    // const users = userStore( (state) => state.users);
    // const currentUser = userStore( (state) => state.currentUser);
    // const setUser = userStore( (state) => state.setUser);



    return {
        users,
        user,
        currentUser,
        login: async (username, password) => {
            try {
                const currentUser = await fetch.post('https://localhost:7256/api/accounts/login', { username, password });
                userStore.setState({ ...initialState, currentUser });

                // get return url from query parameters or default to '/'
                const returnUrl = searchParams.get('returnUrl') || '/';
                router.push(returnUrl);
            } catch (error: any) {
                console.log(error); //toaster
            }
        },
        verify: async (token) => {
            try {
                const token = await fetch.get('https://localhost:7256/api/accounts/verify');
                // userStore.setState({ ...initialState, currentUser });

                // get return url from query parameters or default to '/'
                router.push('/');
            } catch (error: any) {
                console.log(error); //toaster
            }
        },      
        logout: async () => {
            await fetch.post('/api/account/logout');
            router.push('/account/login');
        },
        register: async (user) => {
            try {
                await fetch.post('https://localhost:7256/api/accounts/register',user);
                // await fetch.post('/api/account/register', user);
                // alertService.success('Registration successful', true);
                console.log("User registered"); //toaster
                router.push('/account/login');
            } catch (error: any) {
                console.log(error); //toaster
                // alertService.error(error);
            }
        },
        resetPassword: async (password) => {
            try {
                await fetch.post('https://localhost:7256/api/accounts/resetPassword', password);
                // await fetch.post('/api/account/register', user);
                // alertService.success('Registration successful', true);
                console.log("Password changed succesfully"); //toaster
                const returnUrl = searchParams.get('returnUrl') || '/';
                router.push(returnUrl);
            } catch (error: any) {
                console.log(error); //toaster
                // alertService.error(error);
            }
        },
        getAll: async () => {
            userStore.setState({ users: await fetch.get('/api/users') });
        },
        getById: async (id) => {
            userStore.setState({ user: undefined });
            try {
                userStore.setState({ user: await fetch.get(`/api/users/${id}`) });
            } catch (error: any) {
                //toaster
                console.log(error);
                // alertService.error(error);
            }
        },  
        getCurrent: async () => {
            if (!currentUser) {
                userStore.setState({ currentUser: await fetch.get('/api/users/current') });
            }
        },
        create: async (user) => {
            await fetch.post('/api/users', user);
        },
        update: async (id, params) => {
            await fetch.put(`/api/users/${id}`, params);

            // update current user if the user updated their own record
            if (id === currentUser?.id) {
                userStore.setState({ currentUser: { ...currentUser, ...params } })
            }
        },
        delete: async (id) => {
            // set isDeleting prop to true on user
            userStore.setState({
                users: users!.map(x => {
                    if (x.id === id) { x.isDeleting = true; }
                    return x;
                })
            });

            // delete user
            const response = await fetch.delete(`/api/users/${id}`);

            // remove deleted user from state
            userStore.setState({ users: users!.filter(x => x.id !== id) });

            // logout if the user deleted their own record
            if (response.deletedSelf) {
                router.push('/account/login');
            }
        }
    }
};

// interfaces

interface IUser {
    id?: string,
    firstname: string,
    lastname: string,
    username: string,
    password: string,
    isDeleting?: boolean,
    token?: string
}

interface IUserStore {
    users?: IUser[],
    user?: IUser,
    currentUser?: IUser
}

interface IUserService extends IUserStore {
    login: (username: string, password: string) => Promise<void>,
    verify: (token: string) => Promise<void>,
    resetPassword: (password: string) => Promise<void>,
    logout: () => Promise<void>,
    register: (user: IUser) => Promise<void>,
    getAll: () => Promise<void>,
    getById: (id: string) => Promise<void>,
    getCurrent: () => Promise<void>,
    create: (user: IUser) => Promise<void>,
    update: (id: string, params: Partial<IUser>) => Promise<void>,
    delete: (id: string) => Promise<void>
}