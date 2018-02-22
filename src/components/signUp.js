import React, { Component } from "react";
import {
    Col,
    ControlLabel,
    FormGroup,
    FormControl,
    Button,
    Row,
    HelpBlock,
    Alert
} from "react-bootstrap";

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                errors: {},
            }
        };
    }

    handleChange(e) {
        const { form } = this.state
        const { name, value } = e.target

        form[name] = value

        this.setState({
            form: form
        })
    }

    handleSubmit() {
        const { onSubmit } = this.props
        const { form } = this.state

        if(onSubmit) {
            onSubmit(form)
            .then((res) => {
                console.log("this is the response that eric is looking for", res);
                // Join the websocket

                const { errors } = res

                if(errors) {
                    this.setState({
                        errors: errors.validations
                    })

                    return
                }
            })
        } else {
            console.log("no onSubmit passed to Signup Component");
        }
    }

    errorsFor(attribute) {
        const { errors } = this.state
        let errorString

        if(errors) {
            const filtered = errors.filter(e => e.param === attribute)

            console.log("filtered", filtered);

            if (filtered) {
                errorString = filtered.map(e => e.param + " " + e.msg).join(", ")
            }
        } else {
            return
        }

        return errorString === undefined ? undefined : errorString
    }

    render(){
        const { form, errors } = this.state
        const { firstName, lastName, email, password } = form

        return (
          
            <form>
            <div id="form-bg">
                <Row>
                    <Col xs={6}>
                        {errors &&
                            <Alert bsStyle="danger" id="alert-check-again">
                                Please check the form and try again.
                            </Alert>
                        }
                    </Col>
                </Row>

            <div className='forms'>
              <h3>Sign-Up</h3>
                 <Row>
                   <Col xs={6}>
                   <FormGroup
                     id="firstName-form-group"
                     validationState={this.errorsFor('firstName') && 'error'}>
                     <ControlLabel id="firstName">First Name</ControlLabel>
                     <FormControl
                       type="text"
                       name="firstName"
                       value={firstName}
                       onChange={this.handleChange.bind(this)}
                     />
                    {this.errorsFor('firstName') &&
                        <HelpBlock id="firstName-help-block">{this.errorsFor('firstName')}</HelpBlock>
                    }
                   </FormGroup>
                   </Col>
                 </Row>

                 <Row>
                   <Col xs={6}>
                    <FormGroup
                        id="lastName-form-group"
                        validationState={this.errorsFor('lastName') && 'error'}>
                       <ControlLabel id="lastName">Last Name</ControlLabel>
                       <FormControl
                       type="text"
                       name="lastName"
                       onChange={this.handleChange.bind(this)}
                       value={lastName}
                       />
                       {this.errorsFor('lastName') &&
                       <HelpBlock id="lastName-help-block">{this.errorsFor('lastName')}</HelpBlock>
                   }
                     </FormGroup>
                   </Col>
                 </Row>

                 <Row>
                   <Col xs={6}>
                     <FormGroup
                        id="email-form-group"
                        validationState={this.errorsFor('email') && 'error'}>
                       <ControlLabel id="email">Email</ControlLabel>
                       <FormControl
                       type="text"
                       name="email"
                       onChange={this.handleChange.bind(this)}
                       value={email}
                       />
                       {this.errorsFor('email') &&
                       <HelpBlock id="email-help-block">{this.errorsFor('email')}</HelpBlock>
                        }
                     </FormGroup>
                   </Col>
                 </Row>

                 <Row>
                   <Col xs={6}>
                     <FormGroup
                        id="password-form-group"
                        validationState={this.errorsFor('password') && 'error'}>
                       <ControlLabel id="password">Password</ControlLabel>
                       <FormControl
                       type="password"
                       name="password"
                       onChange={this.handleChange.bind(this)}
                       value={password}
                       />
                       {this.errorsFor('password') &&
                       <HelpBlock id="password-help-block">{this.errorsFor('password')}</HelpBlock>
                        }
                     </FormGroup>
                   </Col>
                 </Row>

                

                 <Row>
                   <Col xs={6}>
                     <Button id="submit" onClick={this.handleSubmit.bind(this)}> 
                      Create a Trivia Account! 
                     </Button>
                   </Col>
                 </Row>
                 </div>
                 </div>
               </form>
        );
    }
}

export default SignUp
