import { Grid, makeStyles, useMediaQuery, useTheme, Typography } from "@material-ui/core";
import { FunctionComponent, useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { CommonProps, PaginatedResponse, PaginatedData } from "../../types/common";

const withGrid = <S, T,>(
  Component: FunctionComponent<{
    data: T,
    popover: boolean,
  }>,
  screenTitle: string | null,
  getParam: (id?: number, title?: string) => S | undefined,
  getKey: (item: T) => number,
  fetcher: (param?: S, pageNumber?: number) => Promise<PaginatedResponse<T>>,
) => ({ showErrorMessage }: CommonProps) => {
  const classes = useStyles();

  const { t } = useTranslation();

  // handling media
  const theme = useTheme();
  const belowSm = useMediaQuery(theme.breakpoints.down('sm'));

  const ref = useRef<HTMLDivElement | null>(null);

  const { id, title } = useParams<{ id: string | undefined, title: string | undefined }>();

  const [data, setData] = useState<PaginatedData<T>>({
    data: [],
    pagesFetched: 0,
    totalPages: 0,
  });

  const onFetchMore = useCallback(
    async () => {
      // check if we need to fetch more or not
      if (data.pagesFetched >= data.totalPages) {
        return;
      }
      console.log('called', data.pagesFetched);
      // in this case we need to fetch the next page
      // when we are on the second last page
      const param = getParam(id ? (JSON.parse(id) as number) : undefined, title);
      const result = await fetcher(param, data.pagesFetched + 1);
      if (result.error) {
        // error occurred
        showErrorMessage(result.error.message);
        return;
      }
      setData({
        ...data,
        data: [...data.data, ...result.data],
        pagesFetched: data.pagesFetched + 1,
      });
    },
    [data, id, title, showErrorMessage],
  );

  const scrollObserver = useCallback(
    (node: Element) => {
      new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0) {
            onFetchMore();
          }
        });
      }).observe(node);
    },
    [onFetchMore],
  );

  useEffect(() => {
    const param = getParam(id ? (JSON.parse(id) as number) : undefined, title);
    if (data.pagesFetched === 0) {
      // fetch the data for the first time, which is the first page
      // here we will populate additional information as well
      (async () => {
        const result = await fetcher(param);
        if (result.error) {
          // error occurred
          showErrorMessage(result.error.message);
        } else {
          setData({
            data: result.data,
            pagesFetched: 1,
            totalPages: result.totalPages,
          });
        }
      })();
    }
  }, [data, id, title, showErrorMessage, belowSm]);

  useEffect(() => {
    if (ref.current) {
      scrollObserver(ref.current);
    }
  }, [ref, scrollObserver]);

  const renderTitle = (text: string) => (
    <Typography component="h5" variant="h6" className={classes.title}>
      {text}
    </Typography>
  );

  const renderCard = (item: T, index: number) => (
    <Grid
      innerRef={index === (data.data.length - 1) ? ref : undefined}
      key={getKey(item)}
      item xs={belowSm ? 5 : 3}
      className={classes.card}
    >
      <Component
        data={item}
        popover
      />
    </Grid>
  );

  return (
    <div className={classes.root}>
      {screenTitle && renderTitle(t(screenTitle))}
      {title && renderTitle(title)}
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        {data.data.map(renderCard)}
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: theme.spacing(2, 2, 0),
  },
  card: {
    margin: theme.spacing(2, 0, 0),
  },
  title: {
    margin: theme.spacing(0, 2, 2),
  },
}));

export default withGrid;
