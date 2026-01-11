import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import PageHeader from "../../app/components/PageHeader";
import LoadingState from "../../app/components/LoadingState";
import EmptyState from "../../app/components/EmptyState";
import { usersRepo } from "../../lib/repos/usersRepo";

const PAGE_SIZE = 25;

const UsersPage = () => {
  const navigate = useNavigate();
  const usersQuery = useInfiniteQuery({
    queryKey: ["users"],
    queryFn: ({ pageParam }) => usersRepo.listPage(PAGE_SIZE, pageParam as string | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.lastId
  });

  const rows = usersQuery.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <Box>
      <PageHeader title="Users" />
      {usersQuery.isLoading ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState label="No users found." />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Active Subscription</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Create Date</TableCell>
              <TableCell>Subscription End</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.activeSubscription ? "Yes" : "No"}</TableCell>
                <TableCell>{row.settings?.language ?? "-"}</TableCell>
                <TableCell>
                  {row.createDate ? dayjs(row.createDate.toDate()).format("YYYY-MM-DD") : "-"}
                </TableCell>
                <TableCell>
                  {row.subscriptionEndDate
                    ? dayjs(row.subscriptionEndDate.toDate()).format("YYYY-MM-DD")
                    : "-"}
                </TableCell>
                <TableCell align="right">
                  <Button
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/users/${row.id}`)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {usersQuery.hasNextPage ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button variant="outlined" onClick={() => usersQuery.fetchNextPage()}>
            Load more
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export default UsersPage;
