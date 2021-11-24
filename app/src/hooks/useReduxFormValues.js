import { useSelector } from 'react-redux';


const useReduxFormValues = (form = "defaultForm") => {
    const storeState = useSelector(state => (state));
    const { form: forms } = storeState;
    return forms ? (forms[form]?.values || {}) : {};
}


export default useReduxFormValues;