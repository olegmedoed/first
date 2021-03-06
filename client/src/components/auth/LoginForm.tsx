import * as React from "react";

const EMPTY_DATA = {
  email: "",
  password: ""
};
const EMPTY = {};

interface PropTypes {
  submit: any;
}

interface StateTypes {
  data: any;
  errors: any;
}

export default class LoginForm extends React.Component<PropTypes, StateTypes> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: EMPTY_DATA,
      errors: EMPTY
    };
  }

  onChange = e => {
    const { name, value } = e.target;
    this.setState(prev => ({ data: { ...prev.data, [name]: value } }));
  };

  onSubmit = async e => {
    e.preventDefault();
    const { data } = this.state;
    const errors = validate(data);

    if (Object.keys(errors).length) {
      return this.setState({ errors });
    }

    const { error } = await this.props.submit(this.state.data);

    if (error) {
      this.setState({
        data: EMPTY_DATA,
        errors: {
          server: error.message
        }
      });
    }
  };

  render() {
    const { errors, data } = this.state;
    const errKeys = Object.keys(errors);

    return (
      <div className="card">
        <div className="card-header">Log in</div>
        <div className="card-body">
          {errKeys.length > 0 && (
            <div id="login_validation_errors" className="list-group">
              {errKeys.map(key => (
                <div
                  key={key}
                  className="list-group-item list-group-item-danger"
                >
                  {errors[key]}
                </div>
              ))}
            </div>
          )}
          <form id="login" onSubmit={this.onSubmit}>
            <div className="form-group">
              <label htmlFor="login_email">Email:</label>
              <input
                id="login_email"
                className="form-control"
                name="email"
                type="email"
                onChange={this.onChange}
                value={data.email}
              />
            </div>
            <div className="form-group">
              <label htmlFor="login_password">Password:</label>
              <input
                id="login_password"
                className="form-control"
                name="password"
                type="password"
                onChange={this.onChange}
                value={data.password}
              />
            </div>
            <div>
              <button className="btn btn-block btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function validate({ email, name, password }) {
  const errors: { password?: string } = {};

  if (password.length < 8) errors.password = "Password too short";

  return errors;
}
