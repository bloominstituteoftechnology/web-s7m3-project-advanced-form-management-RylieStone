// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, { useState } from 'react'
import * as yup from "yup"
import { useEffect } from 'react'
import axios from 'axios'
const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}
// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.
const schema = yup.object().shape({
  username: yup.string().trim().required(e.usernameRequired).min(3, e.usernameMin).max(20, e.usernameMax),
  favLanguage: yup.string().required(e.favLanguageRequired).oneOf(["javascript", "rust"], e.favLanguageOptions),
  favFood: yup.string().required(e.favFoodRequired).oneOf(["broccoli", "spaghetti", "pizza"], e.favFoodOptions),
  agreement: yup.boolean().required(e.agreementRequired).oneOf([true], e.agreementOptions)
})

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.
  const [failedres, setfailedres] = useState(false)
  const [successres, setsuccessres] = useState(false)
  const [Disablesub, setDisabledsub] = useState(true)
  const [formErrors, setFromErrors] = useState({
    username: "",
    favLanguage: "",
    favFood: "",
    agreement: ""
  })
  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.
  const [formData, setFormdata] = useState({
    username: "",
    favLanguage: "",
    favFood: "",
    agreement: false
  })
  useEffect(() => {
    schema.isValid(formData).then(valid => setDisabledsub(!valid))
  }, [formData])

  const validate = (name, value) => {
    yup.reach(schema, name)
    .validate(value)
    .then(() => {setFromErrors({...formErrors, [name]: ""})})
    .catch(err => {setFromErrors({...formErrors, [name]: err.errors[0]})})
  }
  const onChange = evt => {
    const {value, name, checked, type} = evt.target
    const valueToUse = type === "checkbox" ? checked : value
    setFormdata({...formData, [name]: valueToUse})
    validate(name, valueToUse)
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
  }
  const onSubmit = evt => {
    evt.preventDefault()
    setDisabledsub(true)
    axios.post('https://webapis.bloomtechdev.com/registration', formData)
    .then(res => {
      setFormdata({
        username: "",
        favLanguage: "",
        favFood: "",
        agreement: false
      })
      setsuccessres(res.data.message)})
    .catch(err => setfailedres(true))
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.

  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        {successres && <h4 className="success">{successres}</h4>}
        {failedres && <h4 className="error">Sorry! Username is taken</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input id="username" name="username" type="text" placeholder="Type Username" value={formData.username} onChange={onChange}/>
          {formErrors.username && <div className="validation">{formErrors.username}</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input type="radio" name="favLanguage" value="javascript" onChange={onChange} checked={formData.favLanguage === "javascript"}/>
              JavaScript
            </label>
            <label>
              <input type="radio" name="favLanguage" value="rust" onChange={onChange} checked={formData.favLanguage === "rust"}/>
              Rust
            </label>
          </fieldset>
          {formErrors.favLanguage && <div className="validation">{formErrors.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" onChange={onChange} value={formData.favFood}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {formErrors.favFood && <div className="validation">{formErrors.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input id="agreement" type="checkbox" name="agreement" onChange={onChange} checked={formData.agreement}/>
            Agree to our terms
          </label>
          {formErrors.agreement && <div className="validation">{formErrors.agreement}</div>}
        </div>

        <div>
          <input type="submit" disabled={Disablesub} />
        </div>
      </form>
    </div>
  )
}
