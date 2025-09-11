import { CREATE_ADMIN_LOCAL_FAIL, CREATE_ADMIN_LOCAL_REQUEST, CREATE_ADMIN_LOCAL_SUCCESS, GET_ADMIN_BILLING_LOCAL_FAIL, GET_ADMIN_BILLING_LOCAL_REQUEST, GET_ADMIN_BILLING_LOCAL_SUCCESS, GET_ADMIN_LOCAL_FAIL, GET_ADMIN_LOCAL_REQUEST, GET_ADMIN_LOCAL_SUCCESS, GET_ADMIN_TOTAL_LOCAL_FAIL, GET_ADMIN_TOTAL_LOCAL_REQUEST, GET_ADMIN_TOTAL_LOCAL_SUCCESS, UPDATE_ADMIN_LOCAL_FAIL, UPDATE_ADMIN_LOCAL_REQUEST, UPDATE_ADMIN_LOCAL_SUCCESS } from "../../constants/adminPortal/adminPortal_localConstants"

export const getAdminLocalReducers = (state = { users: [] }, action) => {

    switch (action.type) {
        case GET_ADMIN_LOCAL_REQUEST:

            return {
                ...state,
                loading: true,
            }
        case GET_ADMIN_LOCAL_SUCCESS:

            return {
                ...state,
                loading: false,
                adminLOCAL: action.payload
            }
        case GET_ADMIN_LOCAL_FAIL:

            return {
                ...state,
                loading: false,
                error: action.payload

            }

        default:
            return state
    }

}

export const updateAdminLocalReducer = (state = { user: {} }, action) => {

    switch (action.type) {
         case UPDATE_ADMIN_LOCAL_REQUEST:

        return {
            ...state,
            loading: true,
        }
    case UPDATE_ADMIN_LOCAL_SUCCESS:

        return {
            ...state,
            loading: false,
            updateAdminLOCAL: action.payload
        }
    case UPDATE_ADMIN_LOCAL_FAIL:

        return {
            ...state,
            loading: false,
            error: action.payload

        }

        default:
            return state;
    }

}

export const createAdminLocalReducer = (state = { user: {} }, action) => {

    switch (action.type) {
         case CREATE_ADMIN_LOCAL_REQUEST:

        return {
            ...state,
            loading: true,
        }
    case CREATE_ADMIN_LOCAL_SUCCESS:

        return {
            ...state,
            loading: false,
            LOCAL: action.payload
        }
    case CREATE_ADMIN_LOCAL_FAIL:

        return {
            ...state,
            loading: false,
            error: action.payload

        }

        default:
            return state;
    }

}

export const getAdminBillingLocalReducers = (state = { users: [] }, action) => {

    switch (action.type) {
        case GET_ADMIN_BILLING_LOCAL_REQUEST:

            return {
                ...state,
                loading: true,
            }
        case GET_ADMIN_BILLING_LOCAL_SUCCESS:

            return {
                ...state,
                loading: false,
                billingLOCAL: action.payload
            }
        case GET_ADMIN_BILLING_LOCAL_FAIL:

            return {
                ...state,
                loading: false,
                error: action.payload

            }

        default:
            return state
    }

}

export const getAdminTotalLocalReducers = (state = { users: [] }, action) => {

    switch (action.type) {
        case GET_ADMIN_TOTAL_LOCAL_REQUEST:

            return {
                ...state,
                loading: true,
            }
        case GET_ADMIN_TOTAL_LOCAL_SUCCESS:

            return {
                ...state,
                loading: false,
                totalLOCAL: action.payload
            }
        case GET_ADMIN_TOTAL_LOCAL_FAIL:

            return {
                ...state,
                loading: false,
                error: action.payload

            }

        default:
            return state
    }

}


