import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import LoadingState from "../../app/components/LoadingState";
import { useSnack } from "../../app/hooks/useSnack";
import { UserRecord, usersRepo } from "../../lib/repos/usersRepo";
import ProfilesCrud from "./ProfilesCrud";

interface UserFormValues {
  activeSubscription: boolean;
  isOpen: boolean;
  language: string;
  musicOnBG: boolean;
  notifications: boolean;
  subscriptionEndDate: string;
}

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const snack = useSnack();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => (userId ? usersRepo.get(userId) : Promise.resolve(null)),
    enabled: !!userId
  });

  const { register, handleSubmit, reset } = useForm<UserFormValues>({
    defaultValues: {
      activeSubscription: false,
      isOpen: false,
      language: "",
      musicOnBG: false,
      notifications: false,
      subscriptionEndDate: ""
    }
  });

  useEffect(() => {
    if (data) {
      reset({
        activeSubscription: data.activeSubscription ?? false,
        isOpen: data.isOpen ?? false,
        language: data.settings?.language ?? "",
        musicOnBG: data.settings?.musicOnBG ?? false,
        notifications: data.settings?.notifications ?? false,
        subscriptionEndDate: data.subscriptionEndDate
          ? new Date(data.subscriptionEndDate.toDate()).toISOString().split("T")[0]
          : ""
      });
    }
  }, [data, reset]);

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<UserRecord> }) =>
      usersRepo.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
      snack.success("User updated");
    },
    onError: () => snack.error("Failed to update user")
  });

  const onSubmit = (values: UserFormValues) => {
    if (!userId) return;
    updateMutation.mutate({
      id: userId,
      payload: {
        activeSubscription: values.activeSubscription,
        isOpen: values.isOpen,
        settings: {
          language: values.language,
          musicOnBG: values.musicOnBG,
          notifications: values.notifications
        },
        subscriptionEndDate: values.subscriptionEndDate
          ? Timestamp.fromDate(new Date(values.subscriptionEndDate))
          : (data?.subscriptionEndDate as Timestamp | undefined)
      }
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!data) {
    return (
      <Box>
        <Typography variant="h6">User not found</Typography>
        <Button onClick={() => navigate("/users")}>Back</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      <Button variant="text" onClick={() => navigate("/users")}>
        Back to users
      </Button>
      <Card>
        <CardContent sx={{ display: "grid", gap: 2 }}>
          <Typography variant="h6">{data.id}</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "grid", gap: 2 }}>
              <FormControlLabel
                control={<Switch {...register("activeSubscription")} />}
                label="Active Subscription"
              />
              <FormControlLabel control={<Switch {...register("isOpen")} />} label="Is Open" />
              <TextField label="Language" {...register("language")} />
              <FormControlLabel control={<Switch {...register("musicOnBG")} />} label="Music On BG" />
              <FormControlLabel
                control={<Switch {...register("notifications")} />}
                label="Notifications"
              />
              <TextField label="Subscription End Date" type="date" {...register("subscriptionEndDate")} />
              <Button variant="contained" type="submit">
                Save changes
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
      <Box>
        <Typography variant="h6" gutterBottom>
          Profiles
        </Typography>
        {userId ? <ProfilesCrud userId={userId} /> : null}
      </Box>
    </Box>
  );
};

export default UserDetails;
