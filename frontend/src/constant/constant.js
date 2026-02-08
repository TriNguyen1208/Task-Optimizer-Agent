const url = "/api"

//CRUD
const CRUD_SETTING = `${url}/crud/setting`
const CRUD_AUTH = `${url}/crud/auth`
const CRUD_STATISTICS = `${url}/crud/statistics`
const CRUD_TASK = `${url}/crud/task`
const CRUD_INFO = `${url}/crud/info`
const CRUD_SCHEDULE = `${url}/crud/schedule`
const AI_WORKING_TIME = `${url}/ai/working-time`
const AI_SCHEDULE = `${url}/ai/schedule`

const uri = (value) => {
  if (value === undefined || value === null) return '';
  return encodeURIComponent(value);
};

const API_ROUTES = {
    auth: {
        login: `${CRUD_AUTH}/login`,
        refreshToken: `${CRUD_AUTH}/refresh-token`,
        verifyLogin: `${CRUD_AUTH}/login-result`,
        sendResetPassword: `${CRUD_AUTH}/send-reset-password`,
        logout: `${CRUD_AUTH}/logout`,
        signup: `${CRUD_AUTH}/signup`,
        // patch
        updateProfile: `${CRUD_AUTH}/update-profile`,
        updatePassword: `${CRUD_AUTH}/update-password`,
        resetPassword: `${CRUD_AUTH}/reset-password`,
    },
    setting: {
        base: CRUD_SETTING
    },
    statistics: {
        base: CRUD_STATISTICS
    },  
    task: {
        base: CRUD_TASK,
        base_id: (id) => `${CRUD_TASK}/${id}`,
        task_history: `${CRUD_TASK}/task-history`,
        task_name: `${CRUD_TASK}/task-name`
    },
    info: {
        base: CRUD_INFO
    },
    schedule: {
        base: CRUD_SCHEDULE,
        base_id: (id) => `${CRUD_SCHEDULE}/${id}`
    },
    ai: {
        working_time: AI_WORKING_TIME,
        schedule: (task_id) => `${AI_SCHEDULE}/${task_id}`,
    }
}
const STALE_10_MIN = 10 * 60 * 1000

export {url, STALE_10_MIN, API_ROUTES}