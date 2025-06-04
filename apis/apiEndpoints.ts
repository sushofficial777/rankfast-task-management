
export const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;

export const SignInRoute = 'api/login';
export const ResisterRoute = 'api/signup';

// Task Routes
export const CreateTaskRoute = 'api/task';
export const GetAllTasksRoute = 'api/task';
export const GetTaskByIdRoute = (id: string) => `api/task/${id}`;
export const UpdateTaskRoute = (id: string) => `api/task/${id}`;
export const DeleteTaskRoute = (id: string) => `api/task/${id}`;

// User Routes
export const  getAllUsersForSelectRoute = 'user/get-users-for-select'; 

// Notification Routes
export const getUnreadNotificationRoute = 'notification/get-unread-notifications' // get method
export const markNotificationAsReadRoute = (id: string) => `notification/mark-as-read/${id}`; // get method
export const getAllNotificationRoute = 'notification/get-all-notifications' // get method
