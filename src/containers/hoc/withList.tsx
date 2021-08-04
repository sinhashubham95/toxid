import { useState, useEffect, FunctionComponent } from 'react';
import { List, makeStyles } from '@material-ui/core';
import { CommonProps, ListInfo } from '../../types/common';

const withList = <S, T extends ListInfo<S>,>(
  Component: FunctionComponent<{
    data: S,
    showSuccessMessage: (message: string) => void,
    showErrorMessage: (message: string) => void,
  }>,
  fetcher: () => Promise<T>,
) => ({ showSuccessMessage, showErrorMessage }: CommonProps) => {
  const classes = useStyles();

  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    // fetch the data
    if (!data) {
      (async () => {
        const result = await fetcher();
        if (result.error) {
          // error occurred
          showErrorMessage(result.error.message);
          return;
        }
        setData(result);
      })();
    }
  }, [data, showErrorMessage]);

  const renderListItem = (value: S) => (
    <Component
      key={JSON.stringify(value)}
      showSuccessMessage={showSuccessMessage}
      showErrorMessage={showErrorMessage}
      data={value}
    />
  );

  return (
    <div className={classes.root}>
      <List>
        {data?.data.map((value: S) => renderListItem(value))}
      </List>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export default withList;
