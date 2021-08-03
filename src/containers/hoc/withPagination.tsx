import { FunctionComponent, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { CommonProps, PageInfo } from "../../types/common";

const withPagination = <T extends PageInfo,>(
  Component: FunctionComponent<{
    pageNumber: number,
    totalPages: number,
    total: number,
    fetcher: (pageNumber?: number) => Promise<T>,
  }>,
  fetcher: (pageNumber?: number) => Promise<T>,
) => ({ showSuccessMessage, showErrorMessage }: CommonProps) => {
  const classes = useStyles();

  const [pageNumber, setPageNumber] = useState(1);
  const [firstData, setFirstData] = useState<T | null>(null);

  useEffect(() => {
    (async () => {
      const result = await fetcher();
      if (result.error) {
        // error occurred
      } else {
        setFirstData(result);
      }
    })();
  }, []);

  return (
    <div className={classes.root}>
      {firstData && (
        <Component
          pageNumber={pageNumber}
          totalPages={firstData.totalPages}
          total={firstData.total}
          fetcher={fetcher}
        />
      )}
      {firstData && (
        <Pagination
          count={firstData.totalPages}
          boundaryCount={2}
          color="secondary"
          page={pageNumber}
          onChange={(_event, value) => setPageNumber(value)}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default withPagination;
