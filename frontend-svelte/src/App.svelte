<script>
  import { Router, Link, Route } from "svelte-routing";
  import LinkList from "./routes/LinkList.svelte";
  import LinkDetail from "./routes/LinkDetail.svelte";
  import CreateLink from "./routes/CreateLink.svelte";
  import EditLink from "./routes/EditLink.svelte";
  
  export let url = "";
</script>

<Router {url}>
  <nav>
    <Link to="/">Home</Link>
  </nav>

  <main>
    <Route path="/" component={LinkList} />
    <Route path="/link/:id" let:params>
      <LinkDetail id={params.id} />
    </Route>
    <Route path="/create" component={CreateLink} />
    <Route path="/edit/:id" component={EditLink} />
  </main>
</Router>
