import { CREATE_SIP_SIP_PROFILE_FAIL, CREATE_SIP_SIP_PROFILE_REQUEST, CREATE_SIP_SIP_PROFILE_SUCCESS, DELETE_SIP_SIP_PROFILE_FAIL, DELETE_SIP_SIP_PROFILE_REQUEST, DELETE_SIP_SIP_PROFILE_SUCCESS, GET_SIP_SIP_PROFILE_FAIL, GET_SIP_SIP_PROFILE_REQUEST, GET_SIP_SIP_PROFILE_SUCCESS, UPDATE_SIP_SIP_PROFILE_FAIL, UPDATE_SIP_SIP_PROFILE_REQUEST, UPDATE_SIP_SIP_PROFILE_SUCCESS } from "../../constants/sipPortal/sipPortal_sipProfileConstants"

export const getUserSipProfileReducers = (state = { users: [] }, action) => {

    switch (action.type) {
        case GET_SIP_SIP_PROFILE_REQUEST:

            return {
                ...state,
                loading: true,
            }
        case GET_SIP_SIP_PROFILE_SUCCESS:

            return {
                ...state,
                loading: false,
                getSipProfile: action.payload
            }
        case GET_SIP_SIP_PROFILE_FAIL:

            return {
                ...state,
                loading: false,
                error: action.payload

            }

        default:
            return state
    }

}

export const createSIPSipProfileReducer = (state = { user: {} }, action) => {

    switch (action.type) {
         case CREATE_SIP_SIP_PROFILE_REQUEST:

        return {
            ...state,
            loading: true,
        }
    case CREATE_SIP_SIP_PROFILE_SUCCESS:

        return {
            ...state,
            loading: false,
            sipProfile: action.payload
        }
    case CREATE_SIP_SIP_PROFILE_FAIL:

        return {
            ...state,
            loading: false,
            error: action.payload

        }

        default:
            return state;
    }

}

export const updateSIPSipProfileReducer = (state = { user: {} }, action) => {

    switch (action.type) {
         case UPDATE_SIP_SIP_PROFILE_REQUEST:

        return {
            ...state,
            loading: true,
        }
    case UPDATE_SIP_SIP_PROFILE_SUCCESS:

        return {
            ...state,
            loading: false,
            updateSipProfile: action.payload
        }
    case UPDATE_SIP_SIP_PROFILE_FAIL:

        return {
            ...state,
            loading: false,
            error: action.payload

        }

        default:
            return state;
    }

}

export const deleteSIPSipProfileReducer = (state = {}, action) => {

    switch (action.type) {
        case DELETE_SIP_SIP_PROFILE_REQUEST:

            return {
                ...state,

                loading: true,
            }
        case DELETE_SIP_SIP_PROFILE_SUCCESS:

            return {
                ...state,
                loading: false,

                isDeleted: action.payload,
                message: action.payload.message
            }
        case DELETE_SIP_SIP_PROFILE_FAIL:

            return {

                loading: false,

                error: action.payload,
            }

        default:
            return state
    }
}
