import React from 'react';
import ReactDOM from 'react-dom';
import SignUp from '../components/signUp';
import { mount } from 'enzyme'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<SignUp />, div)
})

it("shows flash message when there is an error", ()=>{
  const mockSubmitHandler = jest.fn()
  const validationErrors = [
    {
      param: 'name',
      msg: 'is required.'
    }
  ]
  const component = mount(<NewUser onSubmit={mockSubmitHandler} errors={validationErrors}/>)
  expect(component.find(".alert-danger").length).toBe(1)
})

it("highlights name input when there is an error", ()=>{
  const mockSubmitHandler = jest.fn()
  const validationErrors = [
    {
      param: 'firstName',
      msg: 'is required.'
    }
  ]
  const component = mount(<SignUp onSubmit={mockSubmitHandler} errors={validationErrors}/>)
  expect(component.find('#firstName-form-group.has-error').length).toBe(1)
})


// //begin error for calls
// //name
// it("no help message for name when there is no error", ()=>{
//   const mockSubmitHandler = jest.fn()
//   const component = mount(<NewCat onSubmit={mockSubmitHandler}/>)
//   expect(component.find("#name-help-block").length).toBe(0)
// })
//
// it("shows help message for name when there is an error", ()=>{
//   const mockSubmitHandler = jest.fn()
//   const validationErrors = [
//     {
//       param: 'name',
//       msg: 'is required.'
//     }
//   ]
//   const component = mount(<NewCat onSubmit={mockSubmitHandler} errors={validationErrors}/>)
//   expect(component.find("#name-help-block").length).toBe(1)
// })
//
//
// //age
// it("no help message for age when there is no error", ()=>{
//   const mockSubmitHandler = jest.fn()
//   const component = mount(<NewCat onSubmit={mockSubmitHandler}/>)
//   expect(component.find("#age-help-block").length).toBe(0)
// })
//
// it("shows help message for age when there is an error", ()=>{
//   const mockSubmitHandler = jest.fn()
//   const validationErrors = [
//     {
//       param: 'age',
//       msg: 'is required.'
//     }
//   ]
//   const component = mount(<NewCat onSubmit={mockSubmitHandler} errors={validationErrors}/>)
//   expect(component.find("#age-help-block").length).toBe(1)
// })
//
// //location
// it("no help message for location when there is no error", ()=>{
//   const mockSubmitHandler = jest.fn()
//   const component = mount(<NewCat onSubmit={mockSubmitHandler}/>)
//   expect(component.find("#location-help-block").length).toBe(0)
// })
//
// it("shows help message for location when there is an error", ()=>{
//   const mockSubmitHandler = jest.fn()
//   const validationErrors = [
//     {
//       param: 'location',
//       msg: 'is required.'
//     }
//   ]
//   const component = mount(<NewCat onSubmit={mockSubmitHandler} errors={validationErrors}/>)
//   expect(component.find("#location-help-block").length).toBe(1)
// })
//
// //hobby
// it("no help message for hobby when there is no error", ()=>{
//   const mockSubmitHandler = jest.fn()
//   const component = mount(<NewCat onSubmit={mockSubmitHandler}/>)
//   expect(component.find("#hobby-help-block").length).toBe(0)
// })
//
// it("shows help message for hobby when there is an error", ()=>{
//   const mockSubmitHandler = jest.fn()
//   const validationErrors = [
//     {
//       param: 'hobby',
//       msg: 'is required.'
//     }
//   ]
//   const component = mount(<NewCat onSubmit={mockSubmitHandler} errors={validationErrors}/>)
//   expect(component.find("#hobby-help-block").length).toBe(1)
// })
// //dislikes
// it("no help message for dislikes when there is no error", ()=>{
//   const mockSubmitHandler = jest.fn()
//   const component = mount(<NewCat onSubmit={mockSubmitHandler}/>)
//   expect(component.find("#dislikes-help-block").length).toBe(0)
// })
//
// it("shows help message for dislikes when there is an error", ()=>{
//   const mockSubmitHandler = jest.fn()
//   const validationErrors = [
//     {
//       param: 'dislikes',
//       msg: 'is required.'
//     }
//   ]
//   const component = mount(<NewCat onSubmit={mockSubmitHandler} errors={validationErrors}/>)
//   expect(component.find("#dislikes-help-block").length).toBe(1)
// })
//
// //Quote
// it("no help message for quote when there is no error", ()=>{
//   const mockSubmitHandler = jest.fn()
//   const component = mount(<NewCat onSubmit={mockSubmitHandler}/>)
//   expect(component.find("#quote-help-block").length).toBe(0)
// })
//
// it("shows help message for quote when there is an error", ()=>{
//   const mockSubmitHandler = jest.fn()
//   const validationErrors = [
//     {
//       param: 'quote',
//       msg: 'is required.'
//     }
//   ]
//   const component = mount(<NewCat onSubmit={mockSubmitHandler} errors={validationErrors}/>)
//   expect(component.find("#quote-help-block").length).toBe(1)
// })
// //Looking For
// it("no help message for lookingFor when there is no error", ()=>{
//   const mockSubmitHandler = jest.fn()
//   const component = mount(<NewCat onSubmit={mockSubmitHandler}/>)
//   expect(component.find("#lookingFor-help-block").length).toBe(0)
// })
//
// it("shows help message for lookingFor when there is an error", ()=>{
//   const mockSubmitHandler = jest.fn()
//   const validationErrors = [
//     {
//       param: 'lookingFor',
//       msg: 'is required.'
//     }
//   ]
//   const component = mount(<NewCat onSubmit={mockSubmitHandler} errors={validationErrors}/>)
//   expect(component.find("#lookingFor-help-block").length).toBe(1)
// })
