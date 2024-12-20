import React from "react";

const CustomInput = React.forwardRef((props, ref) => {
  const { type, name, placeholder, classname, value, onChange, onBlur, disabled } = props;
  return (
    <div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`form-control ${classname}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        ref={ref} // Thêm ref vào input element
      />
    </div>
  );
});

export default CustomInput;
