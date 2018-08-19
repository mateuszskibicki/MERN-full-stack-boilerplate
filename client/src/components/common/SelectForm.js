import React from 'react';
import PropTypes from 'prop-types';

const SelectForm = ({
	htmlForAndID,
	name,
	label,
	optionArray,
	value,
	onChange,
	error
}) => {
	return (
		<div className="form-group">
			<label htmlFor={htmlForAndID} className="lead text-left">{label}</label>
			<select 
				className="form-control" 
				id={htmlForAndID} 
				name={name} 
				value={value}
				onChange={onChange}>
				<option value="" defaultValue hidden>Choose here *</option>
				{optionArray.map(option => (<option key={option} value={option}>{option}</option>))}
			</select>
			{_.isEmpty(error) ? null : (
				<small className="form-text alert-danger">{error}</small>
			)}
		</div>
	);
};

SelectForm.propTypes = {
	htmlForAndID : PropTypes.string,
	label : PropTypes.string,
	name : PropTypes.string,
	value : PropTypes.string,
	onChange : PropTypes.func,
	error : PropTypes.string,
	optionArray: PropTypes.array
};

export default SelectForm;
