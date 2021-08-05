import { createRef, useEffect, useState, FunctionComponent } from "react";
import Slider from "react-slick";
import { makeStyles, Typography, IconButton } from "@material-ui/core";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { PaginatedData, PaginatedResponse } from "../../types/common";

const withSlider = <S, T,>(
  Component: FunctionComponent<{
    data: T,
  }>,
  getTitle: (param: S) => string,
  fetcher: (param: S, pageNumber?: number) => Promise<PaginatedResponse<T>>,
) => ({
  data: param,
  showErrorMessage,
}: {
  data: S,
  showErrorMessage: (message: string) => void,
}) => {
    const classes = useStyles();

    const slider = createRef<Slider>();

    const [data, setData] = useState<PaginatedData<T>>({
      data: [],
      pagesFetched: 0,
      totalPages: 0,
    });

    useEffect(() => {
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
    }, [data, param, showErrorMessage]);

    const onSliderChange = async (index: number) => {
      if (index >= (data.data.length - 10)) {
        // in this case we need to fetch the next page
        // when we are on the second last page
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
      }
    };

    const renderPreviousArrow = () => (
      <IconButton
        size="medium"
        onClick={() => slider.current?.slickPrev()}
      >
        <ChevronLeft fontSize="large" />
      </IconButton>
    );

    const renderNextArrow = () => (
      <IconButton
        size="medium"
        onClick={() => slider.current?.slickNext()}
      >
        <ChevronRight fontSize="large" />
      </IconButton>
    );

    const renderCard = (item: T) => (
      <Component
        data={item}
      />
    );

    return (
      <div className={classes.root}>
        <Typography component="h5" variant="h6" className={classes.title}>{getTitle(param)}</Typography>
        <div className={classes.page}>
          {renderPreviousArrow()}
          <Slider
            ref={slider}
            className={classes.slider}
            infinite={false}
            lazyLoad="progressive"
            slidesToShow={5}
            slidesToScroll={5}
            afterChange={onSliderChange}
          >
            {data.data.map(renderCard)}
          </Slider>
          {renderNextArrow()}
        </div>
      </div>
    );
  };

export default withSlider;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: theme.spacing(4),
  },
  title: {
    margin: theme.spacing(0, 10, 1)
  },
  page: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: {
    width: '92%',
  },
}));
