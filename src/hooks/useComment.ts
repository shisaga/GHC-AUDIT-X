import { AddComment, CommentResponse } from "@/types/comment";
import { axiosInstance } from "@/utils/config";
import { useMutation, useQuery, useQueryClient } from "react-query";

const getComments = async (id: string): Promise<CommentResponse[] | []> => {
  if (id) {
    const { data } = await axiosInstance.get(`/api/audit/comment/${id}`);
    return data;
  }
  return [];
};

export const useComments = (id: string) => {
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  return useQuery(["comments"], () => getComments(id), {
    keepPreviousData: true,
  });
};

const addComment = async (comment: AddComment): Promise<Comment> => {
  const { data } = await axiosInstance.post("/api/audit/comment", comment);
  return data;
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addComment, {
    onSuccess: (comment: Comment) => {
      queryClient.invalidateQueries("comments");
    },
  });

  return { isAdding: isLoading, addComment: mutateAsync };
};
