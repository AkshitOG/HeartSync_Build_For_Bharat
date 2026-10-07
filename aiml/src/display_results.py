import json

with open("reports/model_results.json", "r", encoding="utf-8") as f:
    d = json.load(f)

print("=" * 80)
print("JDS MODEL EVALUATION RESULTS (RepeatedStratifiedKFold 5x5 = 25 evaluations)")
print("=" * 80)
for m, v in d["jds"]["summary_metrics"].items():
    print(f"{m:25s} | Acc: {v['accuracy_mean']:.4f} +/- {v['accuracy_std']:.4f} | BalAcc: {v['balanced_accuracy_mean']:.4f} | Prec: {v['precision_mean']:.4f} | Rec: {v['recall_mean']:.4f} | F1: {v['f1_mean']:.4f} | AUC: {v['roc_auc_mean']:.4f}")

print("\n--- JDS LOGISTIC REGRESSION COEFFICIENTS ---")
for feat in d["jds"]["interpretations"]["Logistic Regression"]["features"]:
    print(f"  {feat['feature']:35s}: Coef = {feat['coefficient']:+.4f}, Odds Ratio = {feat['odds_ratio']:.4f} ({feat['direction']})")

print("\n--- JDS RANDOM FOREST FEATURE IMPORTANCE ---")
for feat in d["jds"]["interpretations"]["Random Forest"]["features"]:
    print(f"  {feat['feature']:35s}: Importance = {feat['importance']:.4f} ({feat['importance']*100:.1f}%)")

print("\n" + "=" * 80)
print("SDS MODEL EVALUATION RESULTS (RepeatedStratifiedKFold 5x5 = 25 evaluations)")
print("=" * 80)
for m, v in d["sds"]["summary_metrics"].items():
    print(f"{m:25s} | Acc: {v['accuracy_mean']:.4f} +/- {v['accuracy_std']:.4f} | BalAcc: {v['balanced_accuracy_mean']:.4f} | Prec: {v['precision_mean']:.4f} | Rec: {v['recall_mean']:.4f} | F1: {v['f1_mean']:.4f} | AUC: {v['roc_auc_mean']:.4f}")

print("\n--- SDS LOGISTIC REGRESSION COEFFICIENTS ---")
for feat in d["sds"]["interpretations"]["Logistic Regression"]["features"]:
    print(f"  {feat['feature']:35s}: Coef = {feat['coefficient']:+.4f}, Odds Ratio = {feat['odds_ratio']:.4f} ({feat['direction']})")

print("\n--- SDS RANDOM FOREST FEATURE IMPORTANCE ---")
for feat in d["sds"]["interpretations"]["Random Forest"]["features"]:
    print(f"  {feat['feature']:35s}: Importance = {feat['importance']:.4f} ({feat['importance']*100:.1f}%)")

with open("reports/market_intelligence.json", "r", encoding="utf-8") as f:
    m = json.load(f)

print("\n" + "=" * 80)
print("MARKET-DERIVED SKILL ADJACENCY (Analytics Jobs N = 15,841)")
print("=" * 80)
for item in m["top_15_skill_adjacencies"][:10]:
    print(f"  {item['pair']:30s} | Co-occurrence: {item['cooccurrence_count']:5d} | Jaccard: {item['jaccard_similarity']:.3f} | P(S2|S1): {item['prob_s2_given_s1']:.3f} | P(S1|S2): {item['prob_s1_given_s2']:.3f}")

