import { GET_SIP_BILLING_FAIL, GET_SIP_BILLING_REQUEST, GET_SIP_BILLING_SUCCESS } from "../../constants/sipPortal/sipPortal_billingConstants"

export const getSIPBillingReducers = (state = { users: [] }, action) => {

    switch (action.type) {
        case GET_SIP_BILLING_REQUEST:

            return {
                ...state,
                loading: true,
            }
        case GET_SIP_BILLING_SUCCESS:

            return {
                ...state,
                loading: false,
                billing: action.payload
            }
        case GET_SIP_BILLING_FAIL:

            return {
                ...state,
                loading: false,
                error: action.payload

            }

        default:
            return state
    }

}