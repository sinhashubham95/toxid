import { FunctionComponent, useState, useEffect } from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import { PageInfo } from "../../types/common";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";

const withPagination = <S, T extends PageInfo,>(
  Component: FunctionComponent<{
    param: S,
    pageNumber: number,
    totalPages: number,
    total: number,
    fetcher: (data: S, pageNumber?: number) => Promise<T>,
    showErrorMessage: (message: string) => void,
  }>,
  fetcher: (data: S, pageNumber?: number) => Promise<T>,
) => ({
  showErrorMessage,
  data: param,
}: {
  showErrorMessage: (message: string) => void,
  data: S,
}) => {
    const classes = useStyles();

    const [pageNumber, setPageNumber] = useState(1);
    const [firstData, setFirstData] = useState<T | null>(null);

    useEffect(() => {
      if (!firstData) {
        (async () => {
          const result = await fetcher(param);
          if (result.error) {
            showErrorMessage(result.error.message);
            return;
          }
          setFirstData(result);
        })();
      }
      // eslint-disable-next-line
    }, [firstData]);

    const renderLeftButton = () => (
      <IconButton
        size="medium"
        disabled={pageNumber <= 1}
        onClick={() => setPageNumber(pageNumber - 1)}
        className={classes.button}
      >
        <ChevronLeft fontSize="large" />
      </IconButton>
    );

    const renderRightButton = () => (
      <IconButton
        size="medium"
        disabled={!!firstData && pageNumber >= firstData.totalPages}
        onClick={() => setPageNumber(pageNumber + 1)}
        className={classes.button}
      >
        <ChevronRight fontSize="large" />
      </IconButton>
    );

    return (
      <div className={classes.root}>
        {firstData && (
          <div className={classes.pages}>
            {renderLeftButton()}
            <div className={classes.list}>
              <Component
                param={param}
                pageNumber={pageNumber}
                totalPages={firstData.totalPages}
                total={firstData.total}
                fetcher={fetcher}
                showErrorMessage={showErrorMessage}
              />
            </div>
            {renderRightButton()}
          </div>
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
  pages: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing(0, 1, 0),
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflowX: 'scroll',
    width: "95%",
  },
}));

export default withPagination;
