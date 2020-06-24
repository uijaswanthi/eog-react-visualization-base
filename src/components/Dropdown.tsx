import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles({
  input: {
    margin: 25,
    width: 1000,
  },
  inputRoot: {
    flexWrap: "nowrap"
  }
})

interface IDropdownProps {
  items: Array<string>;
  handleSelectedChange: (event: React.ChangeEvent<{}>, value: string[]) => void;
}

const Dropdown = (props: IDropdownProps) => {

  const classes = useStyles();

  return (
    <Autocomplete
      className={classes.input}
      classes={{
        inputRoot: classes.inputRoot
      }}
      multiple
      options={props.items}
      renderInput={params => (
        <TextField {...params} label="Metrics" variant="outlined" fullWidth />
      )}
      onChange={(event, values) => {
        props.handleSelectedChange(event, values as string[]);
      }}
    />
  )
}

export default Dropdown
