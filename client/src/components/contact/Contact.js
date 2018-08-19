import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {sendEmail} from '../../actions/contactActions';

import TextAreaForm from '../common/TextAreaForm';
import InputForm from '../common/InputForm';

import _ from 'lodash';

class Contact extends Component {
	constructor(props) {
		super(props);
		this.state={
			message: '',
			topic: '',
			errors: {}
		};
	}

	componentDidMount() {
		window.scrollTo(0,0);
	}
  
	componentWillReceiveProps(nextProps) {
		if(nextProps.contact.status) {
			this.setState({
  			message: '',
  			topic: '',
  			errors: ''
  		});
		}
	}
  
  onChange = (e) => {
  	this.setState({ [e.target.name]: e.target.value });
  }

  onSend = (e) => {
  	let errors = {};

  	_.isEmpty(this.state.message) || this.state.message.length < 50 ? errors.message = 'Message is required, min. 50 characters.' : null;
  	_.isEmpty(this.state.topic) || this.state.topic.length < 5 ? errors.topic = 'Topic is required, min. 5 characters.' : null;
    
  	if (!_.isEmpty(errors)) {
  		this.setState({errors: errors});
  	} else {
  		this.props.sendEmail(this.state);
  	}
  }

  render() {
  	const {status, loading} = this.props.contact;
  	return (
  		<div id="contact">
  			<div className="mt-5">
  				<div className="container fade-in-left">
          
  					<div className="add-container add-container-contact mb-5">
  						<div className="jumbotron mt-3 mb-3">
  							<div className="display-4 text-center">Conact me <i className="far fa-envelope"></i></div>
  						</div>
  					</div>
            
  					<div className="mt-5">
  						<h2 className="text-muted text-center">How can I help you?</h2>
  					</div>
            
  					<div className="row">
  						<div className="col-12 col-md-10 col-xl-8 m-auto">            
  							<div className="form mt-5">         
  								<p className="lead text-center text-muted">Leave message for me, min. 50 characters.</p>           
  								<InputForm 
  									type="text"
  									placeholder="Topic: "
  									name="topic"
  									value={this.state.topic}
  									onChange={this.onChange}
  									error={this.state.errors.topic}
  								/>
  								<TextAreaForm 
  									type="text"
  									placeholder="Your message: "
  									name="message"
  									value={this.state.message}
  									onChange={this.onChange}
  									error={this.state.errors.message}
  								/>
                  
  								{_.isEmpty(status) || !status ? (
  									<button className="btn btn-green" onClick={this.onSend}>
  									  {!loading ? 'SEND' : <i className="fas fa-sync fa-spin"></i>}
  									</button>
  								) : (
  									<div>
  									  <button className="btn btn-green fade-in-left">
                        Message has been sent, thank you!
  										</button>
  									</div>
  								)}
  								
                  
                  
  							</div>          
  						</div>
  					</div>
            

  				</div>
  			</div>
  		</div>
  	);
  }
}

Contact.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	contact: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
	contact: state.contact
});

export default connect(mapStateToProps, {sendEmail})(Contact);
