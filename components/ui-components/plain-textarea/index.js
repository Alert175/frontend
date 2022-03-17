import PropTypes from "prop-types";

import classes from "./plain-textarea.module.scss";

const PlainTextarea = ({ label, holder, style, value, changeValue, isDisabled }) => {
	return (
		<div className={`${classes.inputContainer} row`} style={{ opacity: isDisabled ? 0.5 : 1 }}>
			{label ? <span className={classes.label}>{label}</span> : null}
			<textarea
				style={{
					height: "157px",
					width: "100%",
					...style,
				}}
				placeholder={holder}
				value={value}
				onInput={(event) => changeValue(event.target.value)}
				className={`${classes.input} plain-text`}
				disabled={isDisabled}
			/>
		</div>
	);
};

PlainTextarea.propTypes = {
	label: PropTypes.string,
	holder: PropTypes.string,
	style: PropTypes.object,
	value: PropTypes.string,
	changeValue: PropTypes.func,
};

PlainTextarea.defaultProps = {
	label: "",
	holder: "",
	style: {},
	value: "",
	changeValue: () => null,
};

export default PlainTextarea;
