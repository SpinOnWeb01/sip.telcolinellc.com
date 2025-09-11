import { CREATE_ADMIN_SIP_PROFILE_FAIL, CREATE_ADMIN_SIP_PROFILE_REQUEST, CREATE_ADMIN_SIP_PROFILE_SUCCESS, DELETE_ADMIN_SIP_PROFILE_FAIL, DELETE_ADMIN_SIP_PROFILE_REQUEST, DELETE_ADMIN_SIP_PROFILE_SUCCESS, GET_ADMIN_SIP_PROFILE_FAIL, GET_ADMIN_SIP_PROFILE_REQUEST, GET_ADMIN_SIP_PROFILE_SUCCESS, UPDATE_ADMIN_SIP_PROFILE_FAIL, UPDATE_ADMIN_SIP_PROFILE_REQUEST, UPDATE_ADMIN_SIP_PROFILE_SUCCESS } from "../../constants/adminPortal/adminPortal_sipProfileConstants"


export const getAdminSipProfileReducers = (state = { users: [] }, action) => {

    switch (action.type) {
        case GET_ADMIN_SIP_PROFILE_REQUEST:

            return {
                ...state,
                loading: true,
            }
        case GET_ADMIN_SIP_PROFILE_SUCCESS:

            return {
                ...state,
                loading: false,
                getSipProfile: action.payload
            }
        case GET_ADMIN_SIP_PROFILE_FAIL:

            return {
                ...state,
                loading: false,
                error: action.payload

            }

        default:
            return state
    }

}

export const createAdminSipProfileReducer = (state = { user: {} }, action) => {

    switch (action.type) {
         case CREATE_ADMIN_SIP_PROFILE_REQUEST:

        return {
            ...state,
            loading: true,
        }
    case CREATE_ADMIN_SIP_PROFILE_SUCCESS:

        return {
            ...state,
            loading: false,
            sipProfile: action.payload
        }
    case CREATE_ADMIN_SIP_PROFILE_FAIL:

        return {
            ...state,
            loading: false,
            error: action.payload

        }

        default:
            return state;
    }

}

export const updateAdminSipProfileReducer = (state = { user: {} }, action) => {

    switch (action.type) {
         case UPDATE_ADMIN_SIP_PROFILE_REQUEST:

        return {
            ...state,
            loading: true,
        }
    case UPDATE_ADMIN_SIP_PROFILE_SUCCESS:

        return {
            ...state,
            loading: false,
            updateSipProfile: action.payload
        }
    case UPDATE_ADMIN_SIP_PROFILE_FAIL:

        return {
            ...state,
            loading: false,
            error: action.payload

        }

        default:
            return state;
    }

}

export const deleteAdminSipProfileReducer = (state = {}, action) => {

    switch (action.type) {
        case DELETE_ADMIN_SIP_PROFILE_REQUEST:

            return {
                ...state,
                loading: true,
            }
        case DELETE_ADMIN_SIP_PROFILE_SUCCESS:

            return {
                ...state,
                loading: false,
                isDeleted: action.payload,
                message: action.payload.message
            }
        case DELETE_ADMIN_SIP_PROFILE_FAIL:

            return {

                loading: false,
                error: action.payload,
            }

        default:
            return state
    }
}
