import {
  Button,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useContextState } from "../../context/StateProvider";
import { getError } from "../../utils";

export const ProductReviews = ({ product }) => {
  const { state } = useContextState();

  const { userInfo } = state;
  const { enqueueSnackbar } = useSnackbar();

  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);

      setReviews(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
      );

      setLoading(false);

      enqueueSnackbar("Review submitted successfully", { variant: "success" });
      fetchReviews();
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <List>
      <ListItem>
        <Typography name="reviews" id="reviews" variant="h2">
          Customer Reviews
        </Typography>
      </ListItem>

      {reviews?.length === 0 && <ListItem>No review</ListItem>}

      {reviews?.map((review) => (
        <ListItem key={review._id}>
          <Grid container>
            <Grid
              item
              sx={{
                marginRight: "1rem",
                borderRight: "1px #808080 solid",
                paddingRight: "1rem",
              }}
            >
              <Typography>
                <strong>{review.name}</strong>
              </Typography>
              <Typography>{review.createdAt.substring(0, 10)}</Typography>
            </Grid>
            <Grid item>
              <Rating value={review.rating} readOnly />
              <Typography>{review.comment}</Typography>
            </Grid>
          </Grid>
        </ListItem>
      ))}

      <ListItem>
        {userInfo ? (
          <form
            onSubmit={submitHandler}
            style={{ maxWidth: 800, width: "100%" }}
          >
            <List>
              <ListItem>
                <Typography variant="h2">Leave your review</Typography>
              </ListItem>
              <ListItem>
                <TextField
                  multiline
                  variant="outlined"
                  fullWidth
                  name="review"
                  label="Enter comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </ListItem>
              <ListItem>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  // eslint-disable-next-line radix
                  onChange={(e) => setRating(parseInt(e.target.value))}
                />
              </ListItem>
              <ListItem>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>

                {loading && <CircularProgress />}
              </ListItem>
            </List>
          </form>
        ) : (
          <Typography variant="h2">
            Please{" "}
            <Link href={`/login?redirect=/product/${product.slug}`}>login</Link>{" "}
            to write a review
          </Typography>
        )}
      </ListItem>
    </List>
  );
};
