import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Col,
    ControlLabel,
    FormGroup,
    FormControl,
    Row
} from "react-bootstrap";

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                email: "",
                password: "",
                errors: {}
            }
        };
    }
    handleChange(e) {
        const formState = Object.assign({}, this.state.form);
        formState[e.target.name] = e.target.value;
        this.setState({ form: formState });
    }

    render() {
        const { form, errors } = this.state
        const { firstName, lastName, email, password } = form

        return (
            <form>
                <Row>
                    <Col xs={6}>
                        <FormGroup>
                            <ControlLabel id="email"></ControlLabel>
                            <FormControl
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={this.handleChange.bind(this)}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col xs={6}>
                        <FormGroup>
                            <ControlLabel id="password"></ControlLabel>
                            <FormControl
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={this.state.form.password}
                                onChange={this.handleChange.bind(this)}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col xs={6}>
                        <Link to="/games">
                            <Button id="logInbtn">
                                Log into your Trivia Account!
                            </Button>
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <Link to="/signup">
                            <Button id="logInbtn">
                                Dont have a Trivia Accout?
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </form>
        );
    }
}
export default SignIn;
